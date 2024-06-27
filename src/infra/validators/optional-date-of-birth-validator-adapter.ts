import { type DateValidator } from '@/application/validation'
import validator from 'validator'
export class OptionalDateOfBirthValidatorAdapter implements DateValidator {
  isValid (date: string | null): boolean {
    if (date !== null) {
      const dateOfValidation = new Date(date)
      if (isNaN(dateOfValidation.getTime())) {
        return false
      }

      if (dateOfValidation > new Date()) {
        return false
      }

      const isValid = validator.isISO8601(date)
      return isValid
    }
    return true
  }
}
