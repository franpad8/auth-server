const { InvalidParamError, MissingParamError } = require('./errors')
const { ServerError, UnauthorizedError } = require('./http-errors')

module.exports = class HttpResponse {
  static serverError () {
    return {
      statusCode: 500,
      body: new ServerError()
    }
  }

  static badRequest (param) {
    return {
      statusCode: 400,
      body: new MissingParamError(param)
    }
  }

  static authorizationError () {
    return {
      body: new UnauthorizedError(),
      statusCode: 401
    }
  }

  static ok (data) {
    return {
      body: data,
      statusCode: 200
    }
  }

  static unprocessableEntity (param) {
    return {
      body: new InvalidParamError(param),
      statusCode: 422
    }
  }
}
