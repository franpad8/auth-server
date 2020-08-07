const LoginRouter = require('./login-router')
const {
  InvalidParamError,
  MissingParamError,
  ServerError,
  UnauthorizedError
} = require('../../../utils/errors')

const makeSut = function () {
  const authUseCase = makeAuthUseCase()
  authUseCase.authToken = 'validToken'
  const emailValidator = makeEmailValidator()
  emailValidator.isEmailValid = true
  const sut = new LoginRouter(authUseCase, emailValidator)
  return {
    authUseCase,
    sut
  }
}

const makeAuthUseCase = () => {
  class AuthUseCase {
    auth (email, password) {
      this.email = email
      this.password = password
      return this.authToken
    }
  }
  return new AuthUseCase()
}

const makeAuthUseCaseWithError = () => {
  class AuthUseCase {
    auth (email, password) {
      throw new Error()
    }
  }
  return new AuthUseCase()
}

const makeEmailValidator = () => {
  class EmailFormatValidator {
    isValid (email) {
      this.email = email
      return this.isEmailValid
    }
  }
  return new EmailFormatValidator()
}

const makeEmailValidatorWithErrors = () => {
  class EmailFormatValidator {
    isValid (email) {
      throw new Error()
    }
  }

  return new EmailFormatValidator()
}

describe('LoginRouter', function () {
  it('should return 500 if not httpRequest object is provided', async function () {
    const { sut } = makeSut()
    const httpResponse = await sut.route()
    expect(httpResponse.statusCode).toEqual(500)
  })

  it('should return 500 if not request body is provided', async function () {
    const httpRequest = {}
    const { sut } = makeSut()
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toEqual(500)
  })

  it('should return 400 if no email is provided', async function () {
    const httpRequest = {
      body: {
        password: 'letmein'
      }
    }
    const { sut } = makeSut()
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toEqual(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  it('should return 400 if no password is provided', async function () {
    const httpRequest = {
      body: {
        email: 'test@email.com'
      }
    }
    const { sut } = makeSut()
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toEqual(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('should call AuthUseCase with correct arguments', async function () {
    const httpRequest = {
      body: {
        email: 'test@email.com',
        password: 'letmein'
      }
    }
    const { sut, authUseCase } = makeSut()
    await sut.route(httpRequest)
    expect(authUseCase.email).toEqual(httpRequest.body.email)
    expect(authUseCase.password).toEqual(httpRequest.body.password)
  })

  it('should return 200 if correct credentials are provided', async function () {
    const httpRequest = {
      body: {
        email: 'valid_email@email.com',
        password: 'validpassword'
      }
    }
    const { sut, authUseCase } = makeSut()

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toEqual(200)
    expect(httpResponse.body.authToken).toEqual(authUseCase.authToken)
  })

  it('should return 401 when invalid credentials are provided', async function () {
    const httpRequest = {
      body: {
        email: 'invalid_email@email.com',
        password: 'invalidpassword'
      }
    }
    const { sut, authUseCase } = makeSut()
    authUseCase.authToken = null

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toEqual(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })

  it('should return 500 if no AuthUseCase is provided', async function () {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: 'validemail@email.com',
        password: 'validpassword@email.com'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toEqual(500)
  })

  it('should return 500 if AuthUseCase is provided without an auth method', async function () {
    const sut = new LoginRouter({})
    const httpRequest = {
      body: {
        email: 'validemail@email.com',
        password: 'validpassword@email.com'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toEqual(500)
  })

  it('should return 500 if AuthUseCase throws', async function () {
    const httpRequest = {
      body: {
        email: 'valid_email@email.com',
        password: 'validpassword'
      }
    }
    const authUseCase = makeAuthUseCaseWithError()
    const sut = new LoginRouter(authUseCase)

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toEqual(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  it('should return 422 if email is not valid', async function () {
    const httpRequest = {
      body: {
        email: 'valid@email.com',
        password: 'letmein'
      }
    }
    const authUseCase = makeAuthUseCase()
    const emailValidator = makeEmailValidator()
    const sut = new LoginRouter(authUseCase, emailValidator)

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toEqual(422)
    expect(httpResponse.body).toStrictEqual(new InvalidParamError('email'))
  })

  it('should return 500 if no emailValidator is provided', async function () {
    const httpRequest = {
      body: {
        email: 'validemail@email.com',
        password: 'validpassword@email.com'
      }
    }
    const authUseCase = makeAuthUseCase()
    const sut = new LoginRouter(authUseCase)

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toEqual(500)
  })

  it('should return 500 if EmailValidor is provided without an isValid method', async function () {
    const httpRequest = {
      body: {
        email: 'validemail@email.com',
        password: 'validpassword@email.com'
      }
    }
    const authUseCase = makeAuthUseCase()
    const emailValidator = {}
    const sut = new LoginRouter(authUseCase, emailValidator)

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toEqual(500)
  })

  it('should return 500 if EmailValidator throws', async function () {
    const httpRequest = {
      body: {
        email: 'valid_email@email.com',
        password: 'validpassword'
      }
    }
    const authUseCase = makeAuthUseCase()
    const emailValidator = makeEmailValidatorWithErrors()
    const sut = new LoginRouter(authUseCase, emailValidator)

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toEqual(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
