const validator = require('validator')
class EmailValidator {
  isValid (email) {
    return validator.isEmail(email)
  }
}

const makeSut = () => {
  return new EmailValidator()
}

describe('Email Validator', function () {
  it('should return true if validator returns true', function () {
    const sut = makeSut()
    const isEmailValid = sut.isValid('valid_email@email.com')
    expect(isEmailValid).toBe(true)
  })

  it('should return false if validator returns false', function () {
    const sut = makeSut()
    validator.isEmailValid = false
    const isEmailValid = sut.isValid('invalid_email.com')
    expect(isEmailValid).toBe(false)
  })

  it('should call validator with correct email', function () {
    const sut = makeSut()
    sut.isValid('email@email.com')
    expect(validator.email).toEqual('email@email.com')
  })
})
