import { NotFoundError } from '@/application/errors'
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

    it('Should throw if guardianRepository throws', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadById').mockRejectedValueOnce(new Error())
      const promise = sut.confirm('any_id')
      await expect(promise).rejects.toThrow()
    })

    it('Should return Not Found Error if guardianRepository returns null', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadById').mockResolvedValueOnce(null)
      const guardian = await sut.confirm('invalid_id')
      expect(guardian).toEqual({
        isSuccess: false,
        error: new NotFoundError('guardian')
      })
    })
  })
})
