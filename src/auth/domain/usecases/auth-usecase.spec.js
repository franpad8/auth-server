const { MissingParamError } = require('../../../utils/errors')

class AuthUseCase {
  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }
  }
}

const makeSut = () => {
  return new AuthUseCase()
}

describe('AuthUseCase', function () {
  it('should throw if no email is provided', async function () {
    expect.assertions(1)
    const sut = makeSut()
    try {
      await sut.auth()
    } catch (error) {
      expect(error).toEqual(new MissingParamError('email'))
    }
  })

  it('should throw if no password is provided', async function () {
    expect.assertions(1)
    const sut = makeSut()
    const email = 'email@email.com'
    try {
      await sut.auth(email)
    } catch (error) {
      expect(error).toEqual(new MissingParamError('password'))
    }
  })
})
