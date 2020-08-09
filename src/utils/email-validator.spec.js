
class EmailValidator {
  isValid () {
    return true
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
})
