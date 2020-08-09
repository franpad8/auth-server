class MissingParamError extends Error {
  constructor (param) {
    super(`Missing Param: ${param}`)
    this.name = 'MissingParamError'
  }
}

class InvalidParamError extends Error {
  constructor (param) {
    super(`Invalid Param: ${param}`)
    this.name = 'InvalidParamError'
  }
}

module.exports = { InvalidParamError, MissingParamError }
