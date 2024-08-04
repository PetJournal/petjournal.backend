import { type LoadGuardianByIdRepository, type UpdateEmailConfirmationRepository } from '@/data/protocols'
import { DbEmailConfirmation } from '@/data/use-cases'
import { makeFakeGuardianRepository } from '@/tests/utils'

interface SutTypes {
  sut: DbEmailConfirmation
  guardianRepositoryStub: LoadGuardianByIdRepository & UpdateEmailConfirmationRepository
}

const makeSut = (): SutTypes => {
  const guardianRepositoryStub = makeFakeGuardianRepository()
  const sut = new DbEmailConfirmation({ guardianRepository: guardianRepositoryStub })
  return {
    sut,
    guardianRepositoryStub
  }
}

describe('DbEmailConfirmation', () => {
  describe('GuardianRepository loadById', () => {
    it('Should call loadById method with correct value', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      const loadByIdSpy = jest.spyOn(guardianRepositoryStub, 'loadById')
      await sut.confirm('any_id')
      expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
    })
  })
})
