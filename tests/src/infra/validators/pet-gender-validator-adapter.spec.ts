import { PetGenderValidatorAdapter } from '@/infra/validators'
import validator from 'validator'

jest.mock('validator', () => ({
  matches (): boolean {
    return true
  }
}))

const makeSut = (): PetGenderValidatorAdapter => {
  return new PetGenderValidatorAdapter()
}

describe('PetGender Validator Adapter', () => {
  it('Should return false if validation returns false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'matches').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_gender', 'gender')
    expect(isValid).toBe(false)
  })
})
