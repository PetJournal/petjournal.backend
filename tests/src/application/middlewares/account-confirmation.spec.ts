import { EmailConfirmationError, NotFoundError } from '@/application/errors'
import { next, serverError, unauthorized } from '@/application/helpers'
import { AccountConfirmationMiddleware } from '@/application/middlewares/account-confirmation'
import { type LoadGuardianByEmailRepository } from '@/data/protocols'
import {
  makeFakeGuardianRepository
} from '@/tests/utils'

interface SutTypes {
  sut: AccountConfirmationMiddleware
  guardianRepositoryStub: LoadGuardianByEmailRepository
}

const makeSut = (): SutTypes => {
  const guardianRepositoryStub = makeFakeGuardianRepository()
  const sut = new AccountConfirmationMiddleware({
    guardianRepository: guardianRepositoryStub
  })

  return {
    sut,
    guardianRepositoryStub
  }
}

describe('AccountConfirmationMiddleware', () => {
  const httpRequest = {
    body: {
      email: 'any_wmail@mail.com'
    }
  }

  describe('GuardianRepository', () => {
    it('Should call loadByEmail with correct value', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      const loadByEmailSpy = jest.spyOn(guardianRepositoryStub, 'loadByEmail')
      await sut.handle(httpRequest)
      expect(loadByEmailSpy).toBeCalledWith(httpRequest.body.email)
    })

    it('Shoul return 500 (ServerError) if loadByEmail method throws', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest
        .spyOn(guardianRepositoryStub, 'loadByEmail')
        .mockRejectedValueOnce(new Error())
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(serverError(new Error()))
    })

    it('Should return 401 (Unauthorized) if loadByEmail returns null', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadByEmail').mockResolvedValueOnce(null)
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(unauthorized(new NotFoundError('User not found')))
    })

    it('Should return 401 (Unauthorized) if emailConfirmation is false', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadByEmail').mockResolvedValueOnce({
        id: 'any_id',
        firstName: 'any_first_name',
        lastName: 'any_last_name',
        email: 'any_email@mail.com',
        password: 'any_hashed_password',
        phone: 'any_phone',
        accessToken: 'any_hashed_token',
        verificationToken: 'any_verification_token',
        verificationTokenCreatedAt: new Date(),
        emailConfirmation: false
      })
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(
        unauthorized(new EmailConfirmationError('your email are not confirmed'))
      )
    })

    it('Should return 100 (Continue) on success', async () => {
      const { sut } = makeSut()
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(next())
    })
  })
})
