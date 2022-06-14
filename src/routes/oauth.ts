const router = require('express').Router()
import * as passport from 'passport'

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
)

router.get(
  '/google/redirect',
  passport.authenticate('google', {
    failureRedirect: '/',
    successRedirect: '/profile',
    failureFlash: true,
    successFlash: 'Successfully logged in!',
  })
)

export default router
