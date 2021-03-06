class ServerError extends Error {
  constructor () {
    super('Internal Error')
    this.name = 'ServerError'
  }
}

class UnauthorizedError extends Error {
  constructor (param) {
    super(`Missing Param: ${param}`)
    this.name = 'UnauthorizedError'
  }
}

module.exports = { ServerError, UnauthorizedError }
