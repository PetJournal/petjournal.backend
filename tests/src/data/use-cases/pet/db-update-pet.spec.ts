import { DbUpdatePet } from '@/data/use-cases'
import { type UpdatePet, type AppointPet } from '@/domain/use-cases'
import { type LoadPetByGuardianIdRepository, type LoadPetByIdRepository, type LoadGuardianByIdRepository } from '@/data/protocols'
import { makeFakeAppointPetUseCase, makeFakeGuardianRepository, makeFakePetRepository } from '@/tests/utils'
import { PetGender } from '@/domain/models'
import { NotAcceptableError } from '@/application/errors'

interface SutTypes {
  sut: DbUpdatePet
  guardianRepositoryStub: LoadGuardianByIdRepository
  petRepositoryStub: LoadPetByGuardianIdRepository & LoadPetByIdRepository
  appointPetStub: AppointPet

}

const makeSut = (): SutTypes => {
  const guardianRepositoryStub = makeFakeGuardianRepository()
  const petRepositoryStub = makeFakePetRepository()
  const appointPetStub = makeFakeAppointPetUseCase()
  const dependencies: UpdatePet.Dependencies = {
    guardianRepository: guardianRepositoryStub,
    petRepository: petRepositoryStub,
    appointPet: appointPetStub
  }
  const sut = new DbUpdatePet(dependencies)
  return {
    sut,
    guardianRepositoryStub,
    petRepositoryStub,
    appointPetStub
  }
}

describe('DbUpdatePet Use Case', () => {
  const params: UpdatePet.Params = {
    guardianId: 'any_guardian_id',
    petId: 'any_pet_id',
    specieName: 'any_specie_name',
    gender: PetGender.MALE,
    petName: 'any_pet_name',
    breedName: 'any_breed_name',
    size: 'any_size',
    castrated: false,
    dateOfBirth: new Date(2000, 10, 23)
  }

  describe('GuardianRepository', () => {
    it('Should call loadbyId method with correct value', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      const loadByIdSpy = jest.spyOn(guardianRepositoryStub, 'loadById')
      await sut.update(params)
      expect(loadByIdSpy).toHaveBeenCalledWith(params.guardianId)
    })

    it('Should return Not Acceptable error if incorrect guardianId is provided', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadById').mockResolvedValueOnce(null)
      const result = await sut.update(params)
      expect(result).toEqual({
        isSuccess: false,
        error: new NotAcceptableError('userId')
      })
    })

    it('Should throw if loadById method throws', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadById').mockRejectedValue(new Error())
      const promise = sut.update(params)
      await expect(promise).rejects.toThrow()
    })
  })

  describe('PetRepository', () => {
    it('Should call loadById method with correct values', async () => {
      const { sut, petRepositoryStub } = makeSut()
      const loadByIdSpy = jest.spyOn(petRepositoryStub, 'loadById')
      await sut.update(params)
      expect(loadByIdSpy).toHaveBeenCalledWith(params.petId)
    })
  })
})
