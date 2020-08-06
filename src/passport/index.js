const passport = require('passport')
const strategy = require('./strategy')

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  done(null, user)
})

passport.use(strategy)

module.exports = passport
