const GoogleStrategy = require('passport-google-oauth2').Strategy

const strategy = new GoogleStrategy(
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

module.exports = strategy
