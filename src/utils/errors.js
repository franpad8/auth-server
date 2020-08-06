class MissingParamError extends Error {
  constructor (param) {
    super(`Missing Param: ${param}`)
    this.name = 'MissingParamError'
  }
}

class UnauthorizedError extends Error {
  constructor (param) {
    super(`Missing Param: ${param}`)
    this.name = 'MissingParamError'
  }
}

module.exports = { MissingParamError, UnauthorizedError }
