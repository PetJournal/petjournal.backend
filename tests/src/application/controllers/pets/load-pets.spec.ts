import { LoadPetsController } from '@/application/controllers'
import { type LoadPets } from '@/domain/use-cases'
import { makeFakeLoadPetsUseCase, makeFakeServerError } from '@/tests/utils'

interface SutTypes {
  sut: LoadPetsController
  loadPetsStub: LoadPets
}

const makeSut = (): SutTypes => {
  const loadPetsStub = makeFakeLoadPetsUseCase()
  const dependencies: LoadPetsController.Dependencies = {
    loadPets: loadPetsStub
  }
  const sut = new LoadPetsController(dependencies)
  return {
    sut,
    loadPetsStub
  }
}

describe('LoadPets Controller', () => {
  it('Should returns 500 (ServerError) if LoadPets throws', async () => {
    const { sut, loadPetsStub } = makeSut()
    jest.spyOn(loadPetsStub, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(makeFakeServerError())
  })
})
