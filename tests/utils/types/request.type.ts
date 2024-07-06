interface AuthMiddlewareRequest {
  authorization: string
}

interface LoginRequest {
  body: {
    email: string
    password: string
  }
}

interface SignUpRequest {
  body: {
    firstName: string
    lastName: string
    email: string
    password: string
    passwordConfirmation: string
    phone: string
  }
}

interface ForgetPasswordRequest {
  body: {
    email: string
  }
}

interface ChangePasswordRequest {
  userId?: string
  body: {
    password: string
    passwordConfirmation: string
  }
}

interface WaitingCodeRequest {
  body: {
    email: string
    verificationToken: string
  }
}

interface PetRegistryRequest {
  userId?: string
  body: {
    guardianId: string
    specieName: string
    petName: string
    gender: string
    breedName: string
    size: string
    castrated: boolean
    dateOfBirth: Date
  }
}

interface UpdatePetRequest {
  userId?: string
  body: {
    specieName: string
    petName: string
    gender: string
    breedName: string
    size: string
    castrated: boolean
    dateOfBirth: Date
  }
  params: {
    petId: string
  }
}

interface DeletePetRequest {
  userId: string
  params: {
    petId: string
  }
}

export {
  type AuthMiddlewareRequest,
  type LoginRequest,
  type SignUpRequest,
  type ForgetPasswordRequest,
  type ChangePasswordRequest,
  type WaitingCodeRequest,
  type PetRegistryRequest,
  type UpdatePetRequest,
  type DeletePetRequest
}
