import 'module-alias/register'

import * as express from 'express'

import { graphqlHTTP } from 'express-graphql'

import * as cors from 'cors'

import schema from './graphql/schema'
import config from './config'

import { connectDb } from './db'
import cookieSession = require('cookie-session')
import * as passport from 'passport'

import './config/passport'

import oauthRoute from '@local/routes/oauth'
import graphQlRoute from '@local/routes/graphql'

const app = express()

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: ['test'],
  })
)

app.use(passport.initialize())
app.use(passport.session())

connectDb()

app.use(cors())

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
)

app.use('/auth', oauthRoute)
app.use('/gql', graphQlRoute)

app.listen(config.serverPort, () => {
  console.log(`now listening for requests on port ${config.serverPort}`)
})

export default app
