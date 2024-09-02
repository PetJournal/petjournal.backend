import { AccountConfirmationMiddleware } from '@/application/middlewares/account-confirmation'
import { type LoadGuardianByEmailRepository } from '@/data/protocols'
import { makeFakeGuardianRepository } from '@/tests/utils'

interface SutTypes {
  sut: AccountConfirmationMiddleware
  guardianRepositoryStub: LoadGuardianByEmailRepository
}

const makeSut = (): SutTypes => {
  const guardianRepositoryStub = makeFakeGuardianRepository()
  const sut = new AccountConfirmationMiddleware({ guardianRepository: guardianRepositoryStub })

  return {
    sut,
    guardianRepositoryStub
  }
}

describe('AccountConfirmationMiddleware', () => {
  describe('GuardianRepository', () => {
    it('Should call loadByEmail with correct value', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      const loadByEmailSpy = jest.spyOn(guardianRepositoryStub, 'loadByEmail')
      const httpRequest = {
        body: {
          email: 'any_wmail@mail.com'
        }
      }
      await sut.handle(httpRequest)
      expect(loadByEmailSpy).toBeCalledWith(httpRequest.body.email)
    })
  })
})
