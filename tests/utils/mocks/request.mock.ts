import { type TokenDecoder } from '@/data/protocols'
import { PetGender } from '@/domain/models/pet'
import {
  type AuthMiddlewareRequest,
  type LoginRequest,
  type SignUpRequest,
  type ForgetPasswordRequest,
  type ChangePasswordRequest,
  type WaitingCodeRequest,
  type PetRegistryRequest,
  type UpdatePetRequest
} from '@/tests/utils'

const mockGuardianRequest = {
  id: 'any_id',
  firstName: 'any_first_name',
  lastName: 'any_last_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  passwordConfirmation: 'any_password',
  phone: 'any_phone',
  verificationToken: 'valid_code'
}

const makeFakeLoginRequest = (): LoginRequest => {
  const body = {
    email: mockGuardianRequest.email,
    password: mockGuardianRequest.password
  }

  return { body }
}

const makeFakeSignUpRequest = (): SignUpRequest => {
  const body = {
    firstName: mockGuardianRequest.firstName,
    lastName: mockGuardianRequest.lastName,
    email: mockGuardianRequest.email,
    password: mockGuardianRequest.password,
    passwordConfirmation: mockGuardianRequest.passwordConfirmation,
    phone: mockGuardianRequest.phone
  }

  return { body }
}

const makeFakeForgetPasswordRequest = (): ForgetPasswordRequest => {
  const body = {
    email: mockGuardianRequest.email
  }

  return { body }
}

const makeFakeChangePasswordRequest = (): ChangePasswordRequest => {
  const body = {
    password: mockGuardianRequest.password,
    passwordConfirmation: mockGuardianRequest.passwordConfirmation
  }

  return { body }
}

const makeFakeWaitingCodeRequest = (): WaitingCodeRequest => {
  const body = {
    email: mockGuardianRequest.email,
    verificationToken: mockGuardianRequest.verificationToken
  }

  return { body }
}

const makeFakeAuthorizationRequest = (): AuthMiddlewareRequest => {
  const authorization = mockGuardianRequest.id

  return { authorization }
}

const makeFakePayload = (): TokenDecoder.Result => {
  const sub = 'valid_id'

  return { sub }
}

const makeFakePetRegistryRequest = (): PetRegistryRequest => {
  const body = {
    guardianId: 'valid_guardian_id',
    specieName: 'valid_specie_id',
    petName: 'any_name',
    gender: PetGender.MALE,
    breedName: 'valid_breed_name',
    size: 'any_size',
    dateOfBirth: new Date(2000, 10, 23)
  }

  return { body }
}

const makeFakeUpdatePetRequest = (): UpdatePetRequest => {
  const body = {
    specieName: 'valid_specie_id',
    petName: 'any_name',
    gender: PetGender.MALE,
    breedName: 'valid_breed_name',
    size: 'any_size'
  }
  const userId = 'valid_guardian_id'
  const params = {
    petId: 'any_id'
  }

  return { body, params, userId }
}

export {
  makeFakeSignUpRequest,
  makeFakeLoginRequest,
  makeFakeForgetPasswordRequest,
  makeFakeChangePasswordRequest,
  makeFakeWaitingCodeRequest,
  makeFakeAuthorizationRequest,
  makeFakePayload,
  makeFakePetRegistryRequest,
  makeFakeUpdatePetRequest
}
