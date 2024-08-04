import {
  mockFakeGuardianAdded,
  mockFakeGuardianLoaded,
  mockFakePetAdded,
  mockFakeCatBreedsLoaded,
  mockFakeDogBreedsLoaded,
  mockFakePetByGuardianIdLoaded,
  mockFakePetByIdLoaded,
  mockFakePetUpdated,
  mockFakePetByIdDeleted
} from '@/tests/utils'
import {
  type EmailService,
  type AddGuardianRepository,
  type HashComparer,
  type HashGenerator,
  type LoadGuardianByEmailRepository,
  type LoadGuardianByIdRepository,
  type TokenDecoder,
  type TokenGenerator,
  type UpdateAccessTokenRepository,
  type UpdateVerificationTokenRepository,
  type UpdateGuardianPasswordRepository,
  type AddPetRepository,
  type LoadSpecieByIdRepository,
  type LoadSpecieByNameRepository,
  type LoadBreedByNameRepository,
  type LoadSizeByNameRepository,
  type LoadCatBreedsRepository,
  type LoadDogBreedsRepository,
  type LoadPetByGuardianIdRepository,
  type LoadPetByIdRepository,
  type UpdatePetRepository,
  type DeletePetByIdRepository,
  type UpdateEmailConfirmationRepository
} from '@/data/protocols'
import { type LoadCatSizesRepository } from '@/data/protocols/db/size/load-cat-sizes-repository'
import { type LoadDogSizesRepository } from '@/data/protocols/db/size/load-dog-sizes-repository'

const mockHashService = {
  hashedValue: 'hashed_value'
}

const mockTokenService = {
  anyToken: 'any_token',
  validId: { sub: 'valid_id' }
}

const makeFakeGuardianRepository = ():
AddGuardianRepository &
LoadGuardianByEmailRepository &
LoadGuardianByIdRepository &
UpdateAccessTokenRepository &
UpdateGuardianPasswordRepository &
UpdateVerificationTokenRepository &
UpdateEmailConfirmationRepository => {
  class GuardianRepositoryStub implements
  AddGuardianRepository,
  LoadGuardianByEmailRepository,
  LoadGuardianByIdRepository,
  UpdateAccessTokenRepository,
  UpdateGuardianPasswordRepository,
  UpdateVerificationTokenRepository,
  UpdateEmailConfirmationRepository {
    async add (guardian: AddGuardianRepository.Params): Promise<AddGuardianRepository.Result> {
      return mockFakeGuardianAdded()
    }

    async loadByEmail (email: string): Promise<LoadGuardianByEmailRepository.Result> {
      return mockFakeGuardianLoaded()
    }

    async loadById (id: string): Promise<LoadGuardianByIdRepository.Result> {
      return mockFakeGuardianLoaded()
    }

    async updateAccessToken (authentication: UpdateAccessTokenRepository.Params): Promise<boolean> {
      return true
    }

    async updatePassword (userData: UpdateGuardianPasswordRepository.Params): Promise<UpdateGuardianPasswordRepository.Result> {
      return true
    }

    async updateVerificationToken (credentials: UpdateVerificationTokenRepository.Params): Promise<UpdateVerificationTokenRepository.Result> {
      return true
    }

    async updateEmailConfirmation (userId: UpdateEmailConfirmationRepository.Params): Promise<UpdateEmailConfirmationRepository.Result> {
      return true
    }
  }
  return new GuardianRepositoryStub()
}

const makeFakePetRepository = ():
AddPetRepository &
LoadPetByGuardianIdRepository &
LoadPetByIdRepository &
UpdatePetRepository &
DeletePetByIdRepository => {
  class PetRepositoryStub implements
  AddPetRepository,
  LoadPetByGuardianIdRepository,
  LoadPetByIdRepository,
  UpdatePetRepository,
  DeletePetByIdRepository {
    async add (petData: AddPetRepository.Params): Promise<AddPetRepository.Result> {
      return mockFakePetAdded()
    }

    async update (params: UpdatePetRepository.Params): Promise<UpdatePetRepository.Result> {
      return mockFakePetUpdated()
    }

    async loadByGuardianId (guardianId: string): Promise<LoadPetByGuardianIdRepository.Result> {
      return mockFakePetByGuardianIdLoaded()
    }

    async loadById (petId: string): Promise<LoadPetByIdRepository.Result> {
      return mockFakePetByIdLoaded()
    }

    async deleteById (petId: DeletePetByIdRepository.Params): Promise<DeletePetByIdRepository.Result> {
      return mockFakePetByIdDeleted()
    }
  }

  return new PetRepositoryStub()
}

const makeFakeSpecieRepository = ():
LoadSpecieByIdRepository &
LoadSpecieByNameRepository => {
  class SpecieRepositoryStub implements
  LoadSpecieByIdRepository,
  LoadSpecieByNameRepository {
    async loadById (specieData: LoadSpecieByIdRepository.Params): Promise<LoadSpecieByIdRepository.Result> {
      return {
        id: 'any_id',
        name: 'any_name'
      }
    }

    async loadByName (specieData: LoadSpecieByNameRepository.Params): Promise<LoadSpecieByNameRepository.Result> {
      return {
        id: 'any_id',
        name: 'any_name'
      }
    }
  }

  return new SpecieRepositoryStub()
}

const makeFakeBreedRepository = (): LoadBreedByNameRepository => {
  class LoadBreedByNameRepositoryStub implements LoadBreedByNameRepository {
    async loadByName (breedName: LoadBreedByNameRepository.Params): Promise<LoadBreedByNameRepository.Result> {
      return {
        id: 'any_id',
        name: 'any_name',
        specieId: 'any_id'
      }
    }
  }
  return new LoadBreedByNameRepositoryStub()
}

const makeFakeSizeRepository = (): LoadSizeByNameRepository => {
  class LoadSizeByNameRepositoryStub implements LoadSizeByNameRepository {
    async loadByName (size: LoadSizeByNameRepository.Params): Promise<LoadSizeByNameRepository.Result> {
      return {
        id: 'any_id',
        name: 'any_name',
        specieId: 'any_id'
      }
    }
  }
  return new LoadSizeByNameRepositoryStub()
}

const makeFakeLoadCatBreedRepository = (): LoadCatBreedsRepository => {
  class LoadCatBreedRepositoryStub implements LoadCatBreedsRepository {
    async loadCatBreeds (): Promise<LoadCatBreedsRepository.Result> {
      return mockFakeCatBreedsLoaded()
    }
  }
  return new LoadCatBreedRepositoryStub()
}

const makeFakeLoadDogBreedRepository = (): LoadDogBreedsRepository => {
  class LoadDogBreedsRepositoryStub implements LoadDogBreedsRepository {
    async loadDogBreeds (): Promise<LoadDogBreedsRepository.Result> {
      return mockFakeDogBreedsLoaded()
    }
  }
  return new LoadDogBreedsRepositoryStub()
}

const makeFakeHashService = (): HashGenerator & HashComparer => {
  class HashServiceStub implements HashGenerator, HashComparer {
    async compare (input: HashComparer.Params): Promise<boolean> {
      return true
    }

    async encrypt (input: HashGenerator.Params): Promise<string> {
      return mockHashService.hashedValue
    }
  }
  return new HashServiceStub()
}

const makeFakeTokenService = (): TokenGenerator & TokenDecoder => {
  class TokenServiceStub implements TokenGenerator, TokenDecoder {
    async generate (payload: any): Promise<string> {
      return mockTokenService.anyToken
    }

    async decode (token: TokenDecoder.Params): Promise<TokenDecoder.Result> {
      return mockTokenService.validId
    }
  }
  return new TokenServiceStub()
}

const makeFakeEmailService = (): EmailService => {
  class EmailServiceStub implements EmailService {
    async send (options: EmailService.Options): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new EmailServiceStub()
}

const makeFakeLoadCatSizesRepository = (): LoadCatSizesRepository => {
  class LoadCatSizesRepositoryStub implements LoadCatSizesRepository {
    async loadCatSizes (): Promise<LoadCatSizesRepository.Result> {
      return [
        {
          name: 'any_name'
        }
      ]
    }
  }
  return new LoadCatSizesRepositoryStub()
}

const makeFakeLoadDogSizesRepository = (): LoadDogSizesRepository => {
  class LoadDogSizesRepositoryStub implements LoadDogSizesRepository {
    async loadDogSizes (): Promise<LoadDogSizesRepository.Result> {
      return [
        {
          name: 'any_name'
        }
      ]
    }
  }
  return new LoadDogSizesRepositoryStub()
}

const makeFakeLoadPetByGuardianIdRepository = (): LoadPetByGuardianIdRepository => {
  class LoadPetByGuardianIdRepositoryStub implements LoadPetByGuardianIdRepository {
    async loadByGuardianId (guardianId: string): Promise<LoadPetByGuardianIdRepository.Result> {
      return mockFakePetByGuardianIdLoaded()
    }
  }
  return new LoadPetByGuardianIdRepositoryStub()
}

const makeFakeLoadPetByIdRepository = (): LoadPetByIdRepository => {
  class LoadPetByGuardianIdRepositoryStub implements LoadPetByIdRepository {
    async loadById (petId: string): Promise<LoadPetByIdRepository.Result> {
      return mockFakePetByIdLoaded()
    }
  }
  return new LoadPetByGuardianIdRepositoryStub()
}

export {
  mockHashService,
  mockTokenService,
  makeFakeGuardianRepository,
  makeFakePetRepository,
  makeFakeLoadPetByGuardianIdRepository,
  makeFakeLoadPetByIdRepository,
  makeFakeSpecieRepository,
  makeFakeBreedRepository,
  makeFakeLoadCatBreedRepository,
  makeFakeLoadDogBreedRepository,
  makeFakeHashService,
  makeFakeEmailService,
  makeFakeTokenService,
  makeFakeLoadCatSizesRepository,
  makeFakeLoadDogSizesRepository,
  makeFakeSizeRepository
}
