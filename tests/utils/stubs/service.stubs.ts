import { makeFakePayload, mockFakeGuardianAdded, mockFakeGuardianLoaded } from '@/tests/utils'
import {
  type TokenDecoder,
  type HashGenerator,
  type HashComparer,
  type TokenGenerator,
  type EmailService,
  type AddGuardianRepository,
  type LoadGuardianByIdRepository,
  type LoadGuardianByEmailRepository,
  type UpdateAccessTokenRepository,
  type UpdateGuardianPasswordRepository
} from '@/data/protocols'

const makeFakeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare ({ value, hash }: HashComparer.Params): Promise<HashComparer.Result> {
      return true
    }
  }
  return new HashComparerStub()
}

const makeFakeHashGenerator = (): HashGenerator => {
  class HashComparerStub implements HashGenerator {
    async encrypt ({ value }: HashGenerator.Params): Promise<HashGenerator.Result> {
      return 'hashed_value'
    }
  }
  return new HashComparerStub()
}

const makeFakeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (payload: any): Promise<string> {
      return 'any_token'
    }
  }
  return new TokenGeneratorStub()
}

const makeFakeTokenDecoder = (): TokenDecoder => {
  class TokenDecoderStub implements TokenDecoder {
    async decode (token: TokenDecoder.Params): Promise<TokenDecoder.Result> {
      return makeFakePayload()
    }
  }
  return new TokenDecoderStub()
}

const makeFakeEmailService = (): EmailService => {
  class EmailServiceStub implements EmailService {
    async send (options: EmailService.Options): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new EmailServiceStub()
}

const makeFakeAddGuardianRepository = (): AddGuardianRepository => {
  class AddGuardianRepositoryStub implements AddGuardianRepository {
    async add (id: AddGuardianRepository.Params): Promise<AddGuardianRepository.Result> {
      return mockFakeGuardianAdded()
    }
  }
  return new AddGuardianRepositoryStub()
}

const makeFakeLoadGuardianByIdRepository = (): LoadGuardianByIdRepository => {
  class LoadGuardianByIdStub implements LoadGuardianByIdRepository {
    async loadById (id: LoadGuardianByIdRepository.Params): Promise<LoadGuardianByIdRepository.Result> {
      return mockFakeGuardianLoaded()
    }
  }
  return new LoadGuardianByIdStub()
}

const makeFakeLoadGuardianByEmailRepository = (): LoadGuardianByEmailRepository => {
  class LoadGuardianByEmailRepositoryStub implements LoadGuardianByEmailRepository {
    async loadByEmail (email: LoadGuardianByEmailRepository.Params): Promise<LoadGuardianByEmailRepository.Result> {
      return mockFakeGuardianLoaded()
    }
  }
  return new LoadGuardianByEmailRepositoryStub()
}

const makeFakeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (authentication: UpdateAccessTokenRepository.Params): Promise<UpdateAccessTokenRepository.Result> {
      return true
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

const makeFakeUpdateGuardianPasswordRepository = (): UpdateGuardianPasswordRepository => {
  class UpdateGuardianPasswordRepositoryStub implements UpdateGuardianPasswordRepository {
    async updatePassword (userData: UpdateGuardianPasswordRepository.Params): Promise<UpdateGuardianPasswordRepository.Result> {
      return true
    }
  }
  return new UpdateGuardianPasswordRepositoryStub()
}

export {
  makeFakeHashComparer,
  makeFakeHashGenerator,
  makeFakeTokenGenerator,
  makeFakeTokenDecoder,
  makeFakeEmailService,
  makeFakeAddGuardianRepository,
  makeFakeLoadGuardianByIdRepository,
  makeFakeLoadGuardianByEmailRepository,
  makeFakeUpdateAccessTokenRepository,
  makeFakeUpdateGuardianPasswordRepository
}
