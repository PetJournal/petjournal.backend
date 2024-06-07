import { DateOfBirthValidatorAdapter } from '@/infra/validators/date-of-birth-validator-adapter'

describe('DateOfBirthValidatorAdapter', () => {
  it('Should return false if date is an invalid date', () => {
    const sut = new DateOfBirthValidatorAdapter()
    const isValid = sut.isValid('invalid_date')
    expect(isValid).toBe(false)
  })

  it('Should return false if date is not a ISO-8601 date', () => {
    const sut = new DateOfBirthValidatorAdapter()
    const isValid = sut.isValid('2021-13-01')
    expect(isValid).toBe(false)
  })
})
