import * as chai from 'chai'
import * as request from 'supertest'
import * as jsonwebtoken from 'jsonwebtoken'

import app from '../index'
import config from '@local/config'

import { clearDB, createUser } from './helpers'
import { IUser } from '@local/models/user-model'

const expect = chai.expect

const queryGetUser = `
  {
    user {
      id
      name
      username
    }
  }
`

const queryGetAllUsers = `
  {
    users {
      id
      name
      username
    }
  }
`

const mutationSignup = (name: string, username: string, password: string) => `
  mutation {
    signup(
      name: "${name}",
      username: "${username}",
      password: "${password}")
    {
      username
      name
    }
  }
`

const mutationLogin = (username: string, password: string) => `
  mutation {
    login (username: "${username}", password: "${password}")
    {
      token
      user {
        username
      }
    }
  }
`

describe('User', () => {
  beforeEach(clearDB)

  describe('QUERY User', () => {
    let user: IUser
    let server: request.SuperTest<request.Test>
    let token: string
    beforeEach(async () => {
      server = request(app)
      user = await createUser()
      await createUser({ name: 'another name' })
      token = jsonwebtoken.sign({ id: user?.id }, config.jwtSecret!, {
        expiresIn: '1d',
      })
    })

    it('should get user', (done) => {
      server
        .post('/graphql')
        .set('Authorization', token)
        .send({ query: queryGetUser })
        .expect(200)
        .end((err: any, res: any) => {
          if (err) {
            return done(err)
          }

          expect(res.body).to.be.an('object')
          expect(res.body.data).to.be.an('object')
          expect(res.body.data.user).to.haveOwnProperty('id').equal(user?.id)
          expect(res.body.data.user)
            .to.haveOwnProperty('name')
            .equal(user?.name)
          expect(res.body.data.user)
            .to.haveOwnProperty('username')
            .equal(user?.username)

          done()
        })
    })

    it('should not get user with an invalid token', (done) => {
      server
        .post('/graphql')
        .set('Authorization', 'wrong')
        .send({ query: queryGetUser })
        .expect(200)
        .end((err: any, res: any) => {
          if (err) {
            return done(err)
          }

          expect(res.body.errors).to.be.an('array')
          expect(res.body.errors[0]).to.be.an('object')
          expect(res.body.errors[0].message).equal('jwt malformed')
          expect(res.body.data.user).to.be.null

          done()
        })
    })

    it('should get all users', (done) => {
      server
        .post('/graphql')
        .set('Authorization', token)
        .send({ query: queryGetAllUsers })
        .expect(200)
        .end((err: any, res: any) => {
          if (err) {
            return done(err)
          }

          const randomUser = Math.floor(
            Math.random() * res.body.data.users.length
          )

          expect(res.body).to.be.an('object')
          expect(res.body.data).to.be.an('object')
          expect(res.body.data.users).to.be.an('array').to.have.length(2)
          expect(res.body.data.users[randomUser]).to.haveOwnProperty('id')
          expect(res.body.data.users[randomUser]).to.haveOwnProperty('name')
          expect(res.body.data.users[randomUser]).to.haveOwnProperty('username')

          done()
        })
    })

    it('should not get all users with an invalid token', (done) => {
      server
        .post('/graphql')
        .set('Authorization', 'wrong')
        .send({ query: queryGetAllUsers })
        .expect(200)
        .end((err: any, res: any) => {
          if (err) {
            return done(err)
          }

          expect(res.body.errors).to.be.an('array')
          expect(res.body.errors[0]).to.be.an('object')
          expect(res.body.errors[0].message).equal('jwt malformed')
          expect(res.body.data.users).to.be.null

          done()
        })
    })
  })

  describe('MUTATION User', () => {
    let server: request.SuperTest<request.Test>
    let user: IUser
    let token: string
    beforeEach(async () => {
      server = request(app)
      user = await createUser()
      token = jsonwebtoken.sign({ id: user?.id }, config.jwtSecret!, {
        expiresIn: '1d',
      })
      await createUser()
    })

    it('should signup a user', (done) => {
      server
        .post('/graphql')
        .send({
          query: mutationSignup('name', 'username', 'password'),
        })
        .expect(200)
        .end((err: any, res: any) => {
          if (err) {
            return done(err)
          }

          expect(res.body).to.be.an('object')
          expect(res.body.data).to.be.an('object')
          expect(res.body.data.signup).to.be.an('object')
          expect(res.body.data.signup)
            .to.haveOwnProperty('username')
            .equals('username')

          done()
        })
    })

    it('should not signup a user without username', (done) => {
      server
        .post('/graphql')
        .send({
          query: mutationSignup('name', '', 'password'),
        })
        .expect(200)
        .end((err: any, res: any) => {
          if (err) {
            return done(err)
          }

          expect(res.body.errors).to.be.an('array')
          expect(res.body.errors[0]).to.be.an('object')

          expect(res.body.data.signup).to.be.null

          done()
        })
    })

    it('should not signup a user without name', (done) => {
      server
        .post('/graphql')
        .send({
          query: mutationSignup('', 'username', 'password'),
        })
        .expect(200)
        .end((err: any, res: any) => {
          if (err) {
            return done(err)
          }

          expect(res.body.errors).to.be.an('array')
          expect(res.body.errors[0]).to.be.an('object')

          expect(res.body.data.signup).to.be.null

          done()
        })
    })

    it('should not signup a user without password', (done) => {
      server
        .post('/graphql')
        .send({
          query: mutationSignup('name', 'username', ''),
        })
        .expect(200)
        .end((err: any, res: any) => {
          if (err) {
            return done(err)
          }

          expect(res.body.errors).to.be.an('array')
          expect(res.body.errors[0]).to.be.an('object')

          expect(res.body.data.signup).to.be.null

          done()
        })
    })

    it('should login a user', (done) => {
      server
        .post('/graphql')
        .send({
          query: mutationLogin('testusername', 'testpass'),
        })
        .expect(200)
        .end((err: any, res: any) => {
          if (err) {
            return done(err)
          }

          expect(res.body).to.be.an('object')
          expect(res.body.data).to.be.an('object')
          expect(res.body.data.login).to.be.an('object')
          expect(res.body.data.login).to.haveOwnProperty('token')
          expect(res.body.data.login).to.haveOwnProperty('user')
          expect(res.body.data.login.user)
            .to.haveOwnProperty('username')
            .equals('testusername')

          done()
        })
    })

    it('should not login a user with wrong credentials', (done) => {
      server
        .post('/graphql')
        .send({
          query: mutationLogin('wrong', 'wrong'),
        })
        .expect(200)
        .end((err: any, res: any) => {
          if (err) {
            return done(err)
          }

          expect(res.body).to.be.an('object')
          expect(res.body.data.login).to.be.null

          done()
        })
    })

    after(clearDB)
  })
})
