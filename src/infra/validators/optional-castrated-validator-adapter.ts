import { type CastratedValidator } from '@/application/validation/protocols'

export class OptionalCastratedValidatorAdapter implements CastratedValidator {
  isValid (castrated: boolean | null): boolean {
    if (castrated === null || typeof castrated === 'boolean') {
      return true
    }
    return false
  }
}
