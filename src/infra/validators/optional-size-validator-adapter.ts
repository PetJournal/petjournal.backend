import { type SizeValidator } from '@/application/validation/protocols'
import validator from 'validator'

export class OptionalSizeValidatorAdapter implements SizeValidator {
  isValid (size: string | null): boolean {
    const isValidName = (field: string): boolean => validator.matches(field, /^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ ()]/)
    if (size === null || isValidName(size)) {
      return true
    }
    return false
  }
}
