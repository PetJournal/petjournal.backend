import { InvalidParamError } from '@/application/errors'
import { type Validation } from '@/application/protocols'

export class DateValidation implements Validation {
  private readonly fieldName: string

  constructor (fieldName: string) {
    this.fieldName = fieldName
  }

  validate (input: any): void | Error {
    if (typeof input[this.fieldName] !== 'string') {
      return new InvalidParamError(this.fieldName)
    }
  }
}
