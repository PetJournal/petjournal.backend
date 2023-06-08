import { ForgetPasswordTokenGenerator } from '@/data/use-cases/forget-password-token-generation'
import { type SaveTokenRepository, type HashGenerator } from '@/data/protocols'
import { makeEncrypter } from '@/tests/utils'

interface SutTypes {
  sut: ForgetPasswordTokenGenerator
  encrypterStub: HashGenerator
  saveTokenRepositoryStub: SaveTokenRepository
}

const makeSaveTokenRepository = (): SaveTokenRepository => {
  class SaveTokenRepositoryStub implements SaveTokenRepository {
    async saveToken (userId: string, token: string): Promise<SaveTokenRepository.Result> {
      return await new Promise(resolve => { resolve(true) })
    }
  }
  return new SaveTokenRepositoryStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const saveTokenRepositoryStub = makeSaveTokenRepository()
  const sut = new ForgetPasswordTokenGenerator(encrypterStub, saveTokenRepositoryStub)
  return {
    sut,
    encrypterStub,
    saveTokenRepositoryStub
  }
}

describe('ForgetPasswordTokenGenerator', () => {
  it('Should return a token on success', async () => {
    const { sut } = makeSut()
    const token = await sut.generate('1')
    expect(token).toBeTruthy()
    expect(token).toHaveLength(6)
  })

  it('Should call Encrypter with correct value', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.generate('1')
    expect(encryptSpy).toBeCalled()
  })

  it('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promise = sut.generate('1')
    await expect(promise).rejects.toThrow()
  })

  it('Should call SaveTokenRepository with correct values', async () => {
    const { sut, saveTokenRepositoryStub } = makeSut()
    const saveTokenSpy = jest.spyOn(saveTokenRepositoryStub, 'saveToken')
    await sut.generate('1')
    expect(saveTokenSpy).toHaveBeenCalledWith('1', 'hashed_password')
  })

  it('Should throw if SaveTokenRepository throws', async () => {
    const { sut, saveTokenRepositoryStub } = makeSut()
    jest.spyOn(saveTokenRepositoryStub, 'saveToken').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promise = sut.generate('1')
    await expect(promise).rejects.toThrow()
  })
})