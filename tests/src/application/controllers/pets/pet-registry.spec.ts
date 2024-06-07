import { PetRegistryController } from '@/application/controllers'
import { InvalidParamError } from '@/application/errors'
import { badRequest, create, notAcceptable } from '@/application/helpers'
import { type Validation } from '@/application/protocols'
import { type AddPet } from '@/domain/use-cases'
import { makeFakeAddPetUseCase, makeFakePetRegistryRequest, makeFakeServerError, makeFakeValidation, mockFakePetAdded } from '@/tests/utils'

interface SutTypes {
  sut: PetRegistryController
  addPetStub: AddPet
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = makeFakeValidation()
  const addPetStub = makeFakeAddPetUseCase()
  const dependencies: PetRegistryController.Dependencies = {
    validation: validationStub,
    addPet: addPetStub
  }
  const sut = new PetRegistryController(dependencies)
  return { sut, validationStub, addPetStub }
}

describe('PetRegistry Controller', () => {
  const httpRequest = makeFakePetRegistryRequest()

  describe('AddPet', () => {
    it('Should return 406 (NotAcceptable) if invalid data is provided', async () => {
      const { sut, addPetStub } = makeSut()
      jest.spyOn(addPetStub, 'add').mockResolvedValue({
        isSuccess: false,
        error: new InvalidParamError('specieAlias')
      })

      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(notAcceptable(new InvalidParamError('specieAlias')))
    })

    it('should return 500 (ServerError) if add throws', async () => {
      const { sut, addPetStub } = makeSut()
      jest.spyOn(addPetStub, 'add').mockRejectedValue(new Error())

      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(makeFakeServerError())
    })

    it('Should call add with correct values', async () => {
      const { sut, addPetStub } = makeSut()
      const addPetSpy = jest.spyOn(addPetStub, 'add')

      await sut.handle(httpRequest)

      expect(addPetSpy).toHaveBeenCalledWith({
        guardianId: httpRequest.userId,
        specieName: httpRequest.body.specieName,
        petName: httpRequest.body.petName,
        gender: httpRequest.body.gender,
        breedName: httpRequest.body.breedName,
        size: httpRequest.body.size,
        dateOfBirth: httpRequest.body.dateOfBirth
      })
    })
  })

  describe('Validation', () => {
    it('Should return 400 (BadRequest) if Validation returns an error', async () => {
      const { sut, validationStub } = makeSut()
      jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())

      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(badRequest(new Error()))
    })

    it('Should call Validation with correct values', async () => {
      const { sut, validationStub } = makeSut()
      const validateSpy = jest.spyOn(validationStub, 'validate')

      await sut.handle(httpRequest)

      expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
    })
  })

  it('should return 201 (Created) if valid data is provided', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(create(mockFakePetAdded()))
  })
})
