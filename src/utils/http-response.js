const { MissingParamError } = require('./errors')

module.exports = class HttpResponse {
  static serverError () {
    return {
      statusCode: 500
    }
  }

  static badRequest (param) {
    return {
      statusCode: 400,
      body: new MissingParamError(param)
    }
  }
}
