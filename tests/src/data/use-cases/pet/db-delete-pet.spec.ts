import { NotAcceptableError } from '@/application/errors'
import { type DeletePetByIdRepository, type LoadGuardianByIdRepository, type LoadPetByIdRepository } from '@/data/protocols'
import { DbDeletePet } from '@/data/use-cases'
import { type DeletePet } from '@/domain/use-cases'
import { makeFakeGuardianRepository, makeFakePetRepository } from '@/tests/utils'

interface SutTypes {
  sut: DbDeletePet
  guardianRepositoryStub: LoadGuardianByIdRepository
  petRepositoryStub: LoadPetByIdRepository & DeletePetByIdRepository
}

const makeSut = (): SutTypes => {
  const guardianRepositoryStub = makeFakeGuardianRepository()
  const petRepositoryStub = makeFakePetRepository()
  const dependencies: DeletePet.Dependencies = {
    guardianRepository: guardianRepositoryStub,
    petRepository: petRepositoryStub
  }
  const sut = new DbDeletePet(dependencies)
  return {
    sut,
    guardianRepositoryStub,
    petRepositoryStub
  }
}

describe('DbDeletePet  Use Case', () => {
  const params: DeletePet.Param = {
    guardianId: 'any_guardian_id',
    petId: 'any_pet_id'
  }

  describe('GuardianRepository', () => {
    it('Should call loadById method with correct value', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      const loadByIdSpy = jest.spyOn(guardianRepositoryStub, 'loadById')
      await sut.delete(params)
      expect(loadByIdSpy).toHaveBeenCalledWith(params.guardianId)
    })

    it('Should return Not Acceptable error if incorrect guardianId is provided', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadById').mockResolvedValueOnce(null)
      const result = await sut.delete(params)
      expect(result).toEqual({
        isSuccess: false,
        error: new NotAcceptableError('userId')
      })
    })

    it('Should throw if loadById throws', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadById').mockRejectedValueOnce(new Error())
      const promise = sut.delete(params)
      await expect(promise).rejects.toThrow()
    })
  })
})
