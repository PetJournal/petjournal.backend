import { type BreedValidator } from '@/application/validation/protocols'
import validator from 'validator'

export class OptionalBreedValidatorAdapter implements BreedValidator {
  isValid (breedName: string | null): boolean {
    const isValidName = (field: string): boolean => validator.matches(field, /^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ ]{3,}$/)

    if (breedName === null || isValidName(breedName)) {
      return true
    }
    return false
  }
}
