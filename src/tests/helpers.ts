import User, { IUser } from '@local/models/user-model'
export async function clearDB(): Promise<void> {
  await User.deleteMany({})
}

export function createUser(attrs = {}): Promise<IUser> {
  const user = new User(
    Object.assign(
      {
        name: 'Test',
        username: 'testusername',
        password: 'testpass',
      },
      attrs || {}
    )
  )

  return user.save()
}
