import * as passport from 'passport'
import * as passportGoogle from 'passport-google-oauth20'
import User from '@local/models/user-model'

require('dotenv').config()

const GoogleStrategy = passportGoogle.Strategy

passport.serializeUser((user: any, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id)
  done(null, user)
})

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: '/auth/google/redirect',
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log('user profile is: ', profile)
      const user = await User.findOne({ googleId: profile.id })

      // If user doesn't exist creates a new user. (similar to sign up)
      if (!user) {
        const newUser = await User.create({
          googleId: profile.id,
          name: profile.displayName,
          username: profile.displayName,
          email: profile.emails?.[0].value,
        })
        if (newUser) {
          done(null, newUser)
        }
      } else {
        done(null, user)
      }
    }
  )
)
