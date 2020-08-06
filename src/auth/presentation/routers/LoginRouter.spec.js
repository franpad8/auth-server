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
  route (httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return HttpResponse.serverError()
    }
    const { email } = httpRequest.body
    if (!email) {
      return HttpResponse.badRequest('email')
    }
  }
}

const makeSut = function () {
  return new LoginRouter()
}

describe('LoginRouter', function () {
  it('should return 500 if not httpRequest object is provided', function () {
    const sut = makeSut()
    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toEqual(500)
  })

  it('should return 500 if not request body is provided', function () {
    const httpRequest = {}
    const sut = makeSut()
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toEqual(500)
  })

  it('should return 400 if not email is provided', function () {
    const httpRequest = {
      body: {
        password: 'letmein'
      }
    }
    const sut = makeSut()
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toEqual(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })
})
