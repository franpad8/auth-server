const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

require('./passport')(app)

app.use(cors())

app.use(bodyParser.json())

app.listen(3000, () => {
  console.log('Listening on Port 3000')
})
