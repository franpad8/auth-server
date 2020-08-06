const HttpResponse = require('../../../utils/http-response')

module.exports = class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  route (httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return HttpResponse.serverError()
    }
    const { email, password } = httpRequest.body
    if (!email) {
      return HttpResponse.badRequest('email')
    }
    if (!password) {
      return HttpResponse.badRequest('password')
    }
    if (!this.authUseCase || !this.authUseCase.auth) {
      return HttpResponse.serverError()
    }
    const authToken = this.authUseCase.auth(email, password)
    if (!authToken) {
      return HttpResponse.authorizationError()
    }
    return {
      statusCode: 200,
      token: authToken
    }
  }
}
