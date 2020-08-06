const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require('./passport')

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(passport.initialize()) // Used to initialize passport

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

app.listen(3000, () => {
  console.log('Listening on Port 3000')
})
