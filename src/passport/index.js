const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth2').Strategy

module.exports = function (app) {
  app.use(passport.initialize()) // Used to initialize passport

  passport.serializeUser(function (user, done) {
    done(null, user)
  })

  passport.deserializeUser(function (user, done) {
    done(null, user)
  })

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback',
        passReqToCallback: true
      },
      function (request, accessToken, refreshToken, profile, done) {
        const userData = Object.freeze(
          {
            name: profile.displayName,
            token: accessToken
          }
        )
        return done(null, userData)
      }
    )
  )

  app.get('/auth/google',
    passport.authenticate('google', {
      scope:
            ['https://www.googleapis.com/auth/plus.login',
              'https://www.googleapis.com/auth/plus.profile.emails.read']
    }
    ))

  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/auth/google/failure' }),
    (req, res) => {
      const token = req.user.token
      res.redirect(`http://localhost:8000?token=${token}`)
    }
  )
}
