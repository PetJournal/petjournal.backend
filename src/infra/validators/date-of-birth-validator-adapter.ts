import { type DateValidator } from '@/application/validation'

export class DateOfBirthValidatorAdapter implements DateValidator {
  isValid (date: string): boolean {
    const dateToValidate = new Date(date)
    if (isNaN(dateToValidate.getTime())) {
      return false
    }
    return true
  }
}
