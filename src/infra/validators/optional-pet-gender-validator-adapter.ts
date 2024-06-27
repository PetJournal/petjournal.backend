import { type PetGenderValidator } from '@/application/validation/protocols'
import { PetGender } from '@/domain/models/pet'

export class OptionalPetGenderValidatorAdapter implements PetGenderValidator {
  isValid (gender: any | null, fieldName: string): boolean {
    if (Object.values(PetGender).includes(gender[fieldName]) || gender[fieldName] === null) {
      return true
    }
    return false
  }
}
