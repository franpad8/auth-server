class LoginRouter {
  route (httpRequest) {
    if (!httpRequest || !httpRequest.body) {
      return {
        statusCode: 500
      }
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
})
