import * as yup from 'yup'
import * as bcrypt from 'bcrypt'

import User from '@local/models/user-model'

export const signUpRules = yup.object().shape({
  name: yup.string().trim().required(),
  username: yup
    .string()
    .trim()
    .required()
    .min(3, 'Username is too short')
    .test('uniqueUser', 'This user already exists', async (username) => {
      const user = await User.findOne({ username })
      return !user
    }),
  password: yup
    .string()
    .trim()
    .required()
    .min(6, 'Password is too short')
    .matches(
      /[a-zA-Z0-9@!#%]/,
      'Password can only contain Latin letters, numbers and/or [@, !, #, %].'
    ),
})

export const loginRules = yup.object().shape({
  username: yup
    .string()
    .trim()
    .required()
    .test('usernameCheck', 'Invalid username', async (username) => {
      const user = await User.findOne({ username })
      return !!user
    }),
  password: yup
    .string()
    .trim()
    .required()
    .matches(
      /[a-zA-Z0-9@!#%]/,
      'Password can only contain Latin letters, numbers and/or [@, !, #, %].'
    )
    .when('username', (username: string, schema: any) =>
      schema.test({
        test: async (password: string) => {
          const user = await User.findOne({ username })
          const valid = await bcrypt.compare(password, user!.password)
          return valid
        },
        message: 'Invalid password',
      })
    ),
})
