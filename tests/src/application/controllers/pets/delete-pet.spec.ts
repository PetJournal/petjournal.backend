import { PetDeleteController } from '@/application/controllers'
import { InvalidParamError } from '@/application/errors'
import { notAcceptable } from '@/application/helpers'
import { type DeletePet } from '@/domain/use-cases'
import { makeFakeDeletePetRequest, makeFakeDeletePetUseCase, makeFakeServerError } from '@/tests/utils'

interface SutTypes {
  sut: PetDeleteController
  deletePetStub: DeletePet
}

const makeSut = (): SutTypes => {
  const deletePetStub = makeFakeDeletePetUseCase()
  const dependencies: PetDeleteController.Dependencies = {
    petDelete: deletePetStub
  }
  const sut = new PetDeleteController(dependencies)
  return {
    sut,
    deletePetStub
  }
}

describe('DeletePet Controller', () => {
  const httpRequest = makeFakeDeletePetRequest()
  it('Should return 406 (NotAcceptable) if invalid data is provided', async () => {
    const { sut, deletePetStub } = makeSut()
    jest.spyOn(deletePetStub, 'delete').mockResolvedValue({
      isSuccess: false,
      error: new InvalidParamError('anyField')
    })
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(notAcceptable(new InvalidParamError('anyField')))
  })

  it('Should return 500 (ServerError) if deletePet throws', async () => {
    const { sut, deletePetStub } = makeSut()
    jest.spyOn(deletePetStub, 'delete').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(makeFakeServerError())
  })
})
