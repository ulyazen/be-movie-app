/* eslint-disable @typescript-eslint/no-this-alias */
import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'

const Schema = mongoose.Schema

export interface IUser extends mongoose.Document {
  name: string
  email: string
  username: string
  password: string
  googleId: string
}

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String },
    password: { type: String },
    googleId: { type: String },
  },
  { timestamps: true }
)

UserSchema.pre('save', function (next): void {
  const user: any = this

  if (!user.password) {
    next()
  }

  bcrypt.genSalt(10, (err: any, salt: string): void => {
    if (err) {
      throw new Error(err)
    } else {
      bcrypt.hash(user.password, salt, (err: any, hashed: string) => {
        if (err) {
          return next(err)
        }
        user.password = hashed
        next()
      })
    }
  })
})

export default mongoose.model<IUser>('User', UserSchema)
