import { type LoadPetByGuardianIdRepository } from '@/data/protocols'
import { DbLoadPetByGuardianId } from '@/data/use-cases'
import { type LoadPets } from '@/domain/use-cases'
import { makeFakeLoadPetByGuardianIdRepository } from '@/tests/utils'

interface SutTypes {
  sut: DbLoadPetByGuardianId
  petRepositoryStub: LoadPetByGuardianIdRepository
}

const makeSut = (): SutTypes => {
  const petRepositoryStub = makeFakeLoadPetByGuardianIdRepository()
  const dependencies: LoadPets.Dependencies = {
    petRepository: petRepositoryStub
  }
  const sut = new DbLoadPetByGuardianId(dependencies)
  return {
    sut,
    petRepositoryStub
  }
}
describe('DbLoadPetsByGuardianId', () => {
  describe('petRepository', () => {
    it('Should throw if petRepository throws', async () => {
      const { sut, petRepositoryStub } = makeSut()
      const guardianId = { guardianId: 'any_guardian_id' }
      jest.spyOn(petRepositoryStub, 'load').mockRejectedValueOnce(new Error())
      const promise = sut.load(guardianId)
      await expect(promise).rejects.toThrow()
    })

    it('Should call load method with correct value', async () => {
      const { sut, petRepositoryStub } = makeSut()
      const guardianId = { guardianId: 'any_guardian_id' }
      const loadSpy = jest.spyOn(petRepositoryStub, 'load')
      await sut.load(guardianId)
      expect(loadSpy).toHaveBeenCalledWith('any_guardian_id')
    })

    it('Should return a list of pets on success', async () => {
      const { sut } = makeSut()
      const guardianId = { guardianId: 'any_guardian_id' }
      const result = await sut.load(guardianId)
      expect(result).toEqual([{
        petName: 'any_pet_name',
        gender: 'any_pet_gender'
      }])
    })
  })
})
