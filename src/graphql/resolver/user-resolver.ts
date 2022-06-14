import * as _ from 'lodash'
import * as jsonwebtoken from 'jsonwebtoken'
import { GraphQLError } from 'graphql'

import config from '@local/config'
import User, { IUser } from '@local/models/user-model'
import { signUpRules, loginRules } from '@local/rules/user-rules'
import { validateToken } from '@local/middlewares/validate-token'

type LoginResponse = {
  token: string
  user: IUser | null
}

export async function signup(parent: any, args: any): Promise<IUser | Error> {
  try {
    await signUpRules.validate(args)

    const user = new User({
      name: args.name,
      username: args.username,
      password: args.password,
    })

    return await user.save()
  } catch (err: any) {
    return new GraphQLError(err)
  }
}

export async function login(
  parent: any,
  args: any
): Promise<LoginResponse | Error> {
  try {
    await loginRules.validate(args)

    const username = args.username
    const user: IUser | null = await User.findOne({ username })

    if (!user) {
      return { token: '', user: null }
    }

    const token = jsonwebtoken.sign(
      { id: user.id, username },
      config.jwtSecret!,
      { expiresIn: '1d' }
    )

    return { token, user }
  } catch (err: any) {
    return new GraphQLError(err)
  }
}
