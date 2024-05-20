import {
  type AddPetRepository,
  type AddGuardianRepository,
  type LoadGuardianByIdRepository,
  type LoadSpecieByIdRepository,
  type LoadBreedByNameRepository,
  type LoadSizeByNameRepository,
  type LoadCatBreedsRepository,
  type LoadDogBreedsRepository,
  type LoadPetByGuardianIdRepository
} from '@/data/protocols'
import { type PetGender } from '@/domain/models'
import { type AppointPet } from '@/domain/use-cases'
import { type Guardian } from '@/tests/utils/types'

const makeFakeGuardianData = (): Guardian => {
  const fakeGuardian = {
    id: 'any_id',
    firstName: 'any_first_name',
    lastName: 'any_last_name',
    email: 'any_email',
    password: 'any_password',
    phone: 'any_phone',
    accessToken: 'any_token',
    verificationToken: 'any_verification_token',
    verificationTokenCreatedAt: new Date()
  }

  return fakeGuardian
}

const mockFakeGuardianAdded = (): Exclude<AddGuardianRepository.Result, undefined> => {
  return {
    id: 'any_id',
    firstName: 'any_first_name',
    lastName: 'any_last_name',
    email: 'any_email@mail.com',
    phone: 'any_phone'
  }
}

const mockFakePetAdded = (): AddPetRepository.Result => {
  return {
    id: 'any_id',
    guardian: mockFakeGuardianAdded(),
    specie: mockFakeSpecieAdded(),
    petName: 'any_pet_name',
    gender: 'M',
    breed: mockFakeBreedAdded(),
    breedAlias: 'any_breed_alias',
    size: mockFakeSizeAdded(),
    castrated: false
  }
}

const mockFakePetByGuardianIdLoaded = (): Exclude<LoadPetByGuardianIdRepository.Result, undefined> => {
  return [{
    petName: 'any_pet_name',
    gender: 'any_pet_gender' as PetGender
  }]
}

const mockFakeAppointPet = (): AppointPet.Result => {
  return {
    isSuccess: true,
    data: {
      specie: mockFakeSpecieAdded(),
      specieAlias: 'any_specie_alias',
      breed: mockFakeBreedAdded(),
      breedAlias: 'any_breed_alias',
      size: mockFakeSizeAdded(),
      castrated: false
    }
  }
}

const mockFakeSpecieAdded = (): Exclude<LoadSpecieByIdRepository.Result, undefined> => {
  return {
    id: 'any_id',
    name: 'any_name'
  }
}

const mockFakeCatBreedsLoaded = (): LoadCatBreedsRepository.Result => {
  return [{
    name: 'any_name'
  }]
}

const mockFakeDogBreedsLoaded = (): LoadDogBreedsRepository.Result => {
  return [{
    name: 'any_name'
  }]
}

const mockFakeBreedAdded = (): Exclude<LoadBreedByNameRepository.Result, undefined> => {
  return {
    id: 'any_id',
    name: 'any_name',
    specieId: 'any_id'
  }
}

const mockFakeSizeAdded = (): Exclude<LoadSizeByNameRepository.Result, undefined> => {
  return {
    id: 'any_id',
    name: 'any_name',
    specieId: 'any_id'
  }
}

const mockFakeGuardianLoaded = (): Exclude<LoadGuardianByIdRepository.Result, undefined> => {
  return {
    id: 'any_id',
    firstName: 'any_first_name',
    lastName: 'any_last_name',
    email: 'any_email@mail.com',
    password: 'any_hashed_password',
    phone: 'any_phone',
    accessToken: 'any_hashed_token',
    verificationToken: 'any_verification_token',
    verificationTokenCreatedAt: new Date()
  }
}

export {
  makeFakeGuardianData,
  mockFakeGuardianAdded,
  mockFakeGuardianLoaded,
  mockFakePetAdded,
  mockFakePetByGuardianIdLoaded,
  mockFakeSpecieAdded,
  mockFakeCatBreedsLoaded,
  mockFakeDogBreedsLoaded,
  mockFakeBreedAdded,
  mockFakeSizeAdded,
  mockFakeAppointPet
}
