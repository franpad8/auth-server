const LoginRouter = require('./login-router')
const { MissingParamError, UnauthorizedError } = require('../../../utils/errors')

const makeSut = function () {
  class AuthUseCase {
    auth (email, password) {
      this.email = email
      this.password = password
      return this.authToken
    }
  }
  const authUseCase = new AuthUseCase()
  authUseCase.authToken = 'validToken'
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

  it('should return 200 if correct credentials are provided', function () {
    const httpRequest = {
      body: {
        email: 'valid_email@email.com',
        password: 'validpassword'
      }
    }
    const { sut } = makeSut()

    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toEqual(200)
  })

  it('should return 401 when invalid credentials are provided', function () {
    const httpRequest = {
      body: {
        email: 'invalid_email@email.com',
        password: 'invalidpassword'
      }
    }
    const { sut, authUseCase } = makeSut()
    authUseCase.authToken = null
    const httpResponse = sut.route(httpRequest)

    expect(httpResponse.statusCode).toEqual(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  it('should return 500 if no AuthUseCase is provided', function () {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'validemail@email.com',
        password: 'validpassword@email.com'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toEqual(500)
  })

  it('should return 500 if AuthUseCase is provided without an auth method', function () {
    const sut = new LoginRouter({})
    const httpRequest = {
      body: {
        email: 'validemail@email.com',
        password: 'validpassword@email.com'
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toEqual(500)
  })
})
