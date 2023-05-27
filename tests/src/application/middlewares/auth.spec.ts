import { AuthMiddleware } from '@/application/middlewares'
import { type TokenDecoder, type HashComparer, type LoadGuardianByIdRepository } from '@/data/protocols'
import { success, unauthorized } from '@/application/helpers'
import {
  makeFakePayload,
  makeFakeAuthorization,
  makeTokenDecoder,
  makeHashComparer,
  makeLoadGuardianById,
  makeFakeServerError
} from '@/tests/utils'

interface SutTypes {
  sut: AuthMiddleware
  tokenDecoderStub: TokenDecoder
  hashComparerStub: HashComparer
  loadGuardianByIdStub: LoadGuardianByIdRepository
}

const makeSut = (): SutTypes => {
  const tokenDecoderStub = makeTokenDecoder()
  const hashComparerStub = makeHashComparer()
  const loadGuardianByIdStub = makeLoadGuardianById()
  const dependencies = {
    tokenDecoder: tokenDecoderStub,
    hashComparer: hashComparerStub,
    loadGuardianById: loadGuardianByIdStub
  }
  const sut = new AuthMiddleware(dependencies)
  return { sut, tokenDecoderStub, loadGuardianByIdStub, hashComparerStub }
}

describe('Auth Middleware', () => {
  describe('tests the authorization field', () => {
    it('Should return 401 if no authorization is provided', async () => {
      const { sut } = makeSut()
      const httpRequest = makeFakeAuthorization({ data: '' })

      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(unauthorized())
    })

    it('Should return 401 if invalid authorization is provided', async () => {
      const { sut, tokenDecoderStub } = makeSut()
      const httpRequest = makeFakeAuthorization({ data: 'invalid_token' })
      jest.spyOn(tokenDecoderStub, 'decode').mockResolvedValueOnce(false)

      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(unauthorized())
    })
  })

  describe('tests the tokenDecoder dependency', () => {
    it('Should call tokenDecoder with correct value', async () => {
      const { sut, tokenDecoderStub } = makeSut()
      const httpRequest = makeFakeAuthorization({ data: 'any_token' })
      const spyDecoder = jest.spyOn(tokenDecoderStub, 'decode')

      await sut.handle(httpRequest)

      expect(spyDecoder).toHaveBeenCalledWith(httpRequest.authorization)
    })

    it('Should return 500 if tokenDecoder throws', async () => {
      const { sut, tokenDecoderStub } = makeSut()
      const httpRequest = makeFakeAuthorization({ data: 'any_token' })
      jest.spyOn(tokenDecoderStub, 'decode').mockRejectedValueOnce(new Error())

      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(makeFakeServerError())
    })
  })

  describe('tests the loadGuardianById service', () => {
    it('Should return 401 if invalid payload is provided', async () => {
      const { sut, tokenDecoderStub, loadGuardianByIdStub } = makeSut()
      const httpRequest = makeFakeAuthorization({ data: 'valid_token' })
      jest.spyOn(tokenDecoderStub, 'decode').mockResolvedValueOnce({})
      jest.spyOn(loadGuardianByIdStub, 'loadById').mockResolvedValueOnce(undefined)

      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(unauthorized())
    })

    it('Should return 401 if valid payload is provided with invalid userId', async () => {
      const { sut, tokenDecoderStub, loadGuardianByIdStub } = makeSut()
      const httpRequest = makeFakeAuthorization({ data: 'valid_token' })
      jest.spyOn(tokenDecoderStub, 'decode').mockResolvedValueOnce({ userId: 'invalid_id' })
      jest.spyOn(loadGuardianByIdStub, 'loadById').mockResolvedValueOnce(undefined)

      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(unauthorized())
    })

    it('Should call loadGuardianById with correct value', async () => {
      const { sut, loadGuardianByIdStub } = makeSut()
      const httpRequest = makeFakeAuthorization({ data: 'valid_token' })
      const spyLoadGuardianById = jest.spyOn(loadGuardianByIdStub, 'loadById')

      await sut.handle(httpRequest)

      expect(spyLoadGuardianById).toHaveBeenCalledWith(makeFakePayload().sub)
    })

    it('Should return 401 if authorization not match with accessToken in database', async () => {
      const { sut, hashComparerStub } = makeSut()
      const httpRequest = makeFakeAuthorization({ data: 'valid_token' })
      jest.spyOn(hashComparerStub, 'compare').mockResolvedValueOnce(false)

      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(unauthorized())
    })

    it('Should return 500 if loadGuardianById throws', async () => {
      const { sut, loadGuardianByIdStub } = makeSut()
      const httpRequest = makeFakeAuthorization({ data: 'any_token' })
      jest.spyOn(loadGuardianByIdStub, 'loadById').mockRejectedValueOnce(new Error())

      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(makeFakeServerError())
    })
  })

  describe('test authMiddleware success case', () => {
    it('Should return 200 if success', async () => {
      const { sut } = makeSut()
      const httpRequest = makeFakeAuthorization({ data: 'valid_token' })

      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(success({ userId: makeFakePayload().sub }))
    })
  })
})
