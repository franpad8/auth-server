class MissingParamError extends Error {
  constructor (param) {
    super(`Missing Param: ${param}`)
    this.name = 'MissingParamError'
  }
}

class HttpResponse {
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

class LoginRouter {
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
    this.authUseCase.auth(email, password)
  }
}

const makeSut = function () {
  class AuthUseCase {
    auth (email, password) {
      this.email = email
      this.password = password
    }
  }
  const authUseCase = new AuthUseCase()
  const sut = new LoginRouter(authUseCase)
  return {
    authUseCase,
    sut
  }
}

describe('LoginRouter', function () {
  it('should return 500 if not httpRequest object is provided', function () {
    const { sut } = makeSut()
    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toEqual(500)
  })

  it('should return 500 if not request body is provided', function () {
    const httpRequest = {}
    const { sut } = makeSut()
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toEqual(500)
  })

  it('should return 400 if no email is provided', function () {
    const httpRequest = {
      body: {
        password: 'letmein'
      }
    }
    const { sut } = makeSut()
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toEqual(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('should return 400 if no password is provided', function () {
    const httpRequest = {
      body: {
        email: 'test@email.com'
      }
    }
    const { sut } = makeSut()
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toEqual(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('should call AuthUseCase with correct arguments', function () {
    const httpRequest = {
      body: {
        email: 'test@email.com',
        password: 'letmein'
      }
    }
    const { sut, authUseCase } = makeSut()
    sut.route(httpRequest)
    expect(authUseCase.email).toEqual(httpRequest.body.email)
    expect(authUseCase.password).toEqual(httpRequest.body.password)
  })
})
