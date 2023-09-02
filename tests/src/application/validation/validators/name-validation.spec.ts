import { InvalidParamError } from '@/application/errors'
import { NameValidation, type NameValidator } from '@/application/validation'

interface SutTypes {
  sut: NameValidation
  nameValidatorStub: NameValidator
}

const makeNameValidatorStub = (): NameValidator => {
  class NameValidatorStub implements NameValidator {
    isValid (name: string): boolean {
      return true
    }
  }
  return new NameValidatorStub()
}

const makeSut = (): SutTypes => {
  const fakeFieldName: string = 'fieldName'
  const nameValidatorStub = makeNameValidatorStub()
  const sut = new NameValidation(fakeFieldName, nameValidatorStub)
  return {
    sut,
    nameValidatorStub
  }
}

describe('NameValidation', () => {
  it('should returns invalidParamError if fieldName is not a string', () => {
    const { sut } = makeSut()

    const result = sut.validate({ fieldName: 11 })

    expect(result).toStrictEqual(new InvalidParamError('fieldName'))
  })

  it('should return InvalidParamError if fieldName is not a valid name', () => {
    const { sut, nameValidatorStub } = makeSut()
    jest.spyOn(nameValidatorStub, 'isValid').mockReturnValueOnce(false)

    const result = sut.validate({ fieldName: 'invalid_name' })

    expect(result).toStrictEqual(new InvalidParamError('fieldName'))
  })

  it('should throw if validator throws', () => {
    const { sut, nameValidatorStub } = makeSut()
    jest.spyOn(nameValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })

    expect(() => { sut.validate({ fieldName: 'valid_name' }) }).toThrow()
  })

  it('should call validator with correct argument', () => {
    const { sut, nameValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(nameValidatorStub, 'isValid')

    sut.validate({ fieldName: 'valid_name' })

    expect(isValidSpy).toHaveBeenCalledWith('valid_name')
  })

  it('should return void if fieldName is a valid name', () => {
    const { sut } = makeSut()

    const result = sut.validate({ fieldName: 'valid_name' })

    expect(result).toBeFalsy()
  })
})