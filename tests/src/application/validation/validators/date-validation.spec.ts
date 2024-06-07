import { InvalidParamError } from '@/application/errors'
import { DateValidation } from '@/application/validation'

describe('DateValidation', () => {
  it('Should return an InvalidParamError if date is not a string', () => {
    const sut = new DateValidation('date')
    const error = sut.validate({ date: 1 })
    expect(error).toEqual(new InvalidParamError('date'))
  })
})
