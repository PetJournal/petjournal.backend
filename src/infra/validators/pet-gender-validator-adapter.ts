import { type PetGenderValidator } from '@/application/validation/protocols'
import { PetGender } from '@/domain/models/pet'

export class PetGenderValidatorAdapter implements PetGenderValidator {
  isValid (gender: any, fieldName: string): boolean {
    if (!Object.values(PetGender).includes(gender[fieldName])) {
      return false
    }
    return true
  }
}
