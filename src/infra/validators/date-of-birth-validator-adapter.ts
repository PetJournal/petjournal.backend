import { type DateValidator } from '@/application/validation'
import validator from 'validator'
export class DateOfBirthValidatorAdapter implements DateValidator {
  isValid (date: string): boolean {
    if (isNaN(new Date(date).getTime())) {
      return false
    }
    const isValid = validator.isISO8601(date)
    return isValid
  }
}
