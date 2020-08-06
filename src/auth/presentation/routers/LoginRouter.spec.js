class LoginRouter {
  route (httpRequest) {
    if (!httpRequest) {
      return {
        statusCode: 400
      }
    }
  }
}

const makeSut = function () {
  return new LoginRouter()
}

describe('LoginRouter', function () {
  it('should return 400 if not httpRequest object is provided', function () {
    const sut = makeSut()
    const httpResponse = sut.route()
    expect(httpResponse.statusCode).toEqual(400)
  })
})
