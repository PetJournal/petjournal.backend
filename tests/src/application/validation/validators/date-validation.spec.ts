import { InvalidParamError } from '@/application/errors'
import { DateValidation } from '@/application/validation'

interface SutTypes {
  sut: DateValidation
}

const makeSut = (): SutTypes => {
  const sut = new DateValidation('date')
  return {
    sut
  }
}

describe('DateValidation', () => {
  it('Should return an InvalidParamError if date is not a string', () => {
    const { sut } = makeSut()
    const error = sut.validate({ date: 1 })
    expect(error).toEqual(new InvalidParamError('date'))
  })
})
