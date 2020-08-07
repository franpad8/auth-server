const HttpResponse = require('../../../utils/http-response')

module.exports = class LoginRouter {
  constructor (authUseCase, emailValidator) {
    this.authUseCase = authUseCase
    this.emailValidator = emailValidator
  }

  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body
      if (!email) {
        return HttpResponse.badRequest('email')
      }
      if (!password) {
        return HttpResponse.badRequest('password')
      }
      if (!this.emailValidator.isValid(email)) {
        return HttpResponse.unprocessableEntity('email')
      }

      const authToken = await this.authUseCase.auth(email, password)

      if (!authToken) {
        return HttpResponse.authorizationError()
      }
      return HttpResponse.ok({ authToken })
    } catch (error) {
      return HttpResponse.serverError()
    }
  }
}
