import { type Validation } from '@/application/protocols'
import { BreedValidation, DateValidation, NameValidation, PetGenderValidation, RequiredFieldValidation, SizeValidation, ValidationComposite } from '@/application/validation'
import { CastratedValidation } from '@/application/validation/validators/castrated-validation'
import { OptionalBreedValidatorAdapter, OptionalCastratedValidatorAdapter, OptionalDateOfBirthValidatorAdapter, OptionalNameValidatorAdapter, OptionalPetGenderValidatorAdapter, OptionalSizeValidatorAdapter } from '@/infra/validators'

export const makePetUpdateValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const requiredFields = ['specieName', 'petName', 'gender', 'breedName', 'size', 'castrated', 'dateOfBirth']

  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new NameValidation('specieName', new OptionalNameValidatorAdapter()))
  validations.push(new NameValidation('petName', new OptionalNameValidatorAdapter()))
  validations.push(new PetGenderValidation('gender', new OptionalPetGenderValidatorAdapter()))
  validations.push(new BreedValidation('breedName', new OptionalBreedValidatorAdapter()))
  validations.push(new SizeValidation('size', new OptionalSizeValidatorAdapter()))
  validations.push(new CastratedValidation('castrated', new OptionalCastratedValidatorAdapter()))
  validations.push(new DateValidation('dateOfBirth', new OptionalDateOfBirthValidatorAdapter()))

  return new ValidationComposite(validations)
}
