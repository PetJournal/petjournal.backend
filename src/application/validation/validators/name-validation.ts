import { type NameValidator } from '@/application/validation'
import { type Validation } from '@/application/protocols'
import { InvalidParamError } from '@/application/errors'

export class NameValidation implements Validation {
  constructor (
    private readonly fieldName: string,
    private readonly validator: NameValidator
  ) {}

  validate (input: any): Error | void {
    if (typeof input[this.fieldName] !== 'string' && input[this.fieldName] !== null) {
      return new InvalidParamError(this.fieldName)
    }
    const isValid = this.validator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
