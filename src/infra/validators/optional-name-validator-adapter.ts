import { type NameValidator } from '@/application/validation'
import validator from 'validator'

export class OptionalNameValidatorAdapter implements NameValidator {
  isValid (name: string | null): boolean {
    const isValidName = (field: string): boolean => validator.matches(field, /^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ ]{3,}$/)

    if (name === null || isValidName(name)) {
      return true
    }

    return false
  }
}
