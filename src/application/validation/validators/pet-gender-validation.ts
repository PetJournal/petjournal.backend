import { InvalidParamError } from '@/application/errors'

export class PetGenderValidation {
  constructor (
    private readonly fieldName: string
  ) {}

  validate (input: any): Error | void {
    const gender = input[this.fieldName].toUpperCase()

    if (typeof gender !== 'string') {
      return new InvalidParamError(this.fieldName)
    }

    if (!['M', 'F'].includes(gender)) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
