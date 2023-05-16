import { ForgetPasswordTokenGenerator } from '@/data/use-cases/forget-password-token-generation'
import { type Encrypter } from '@/data/protocols'
import { type SaveToken } from '@/domain/use-cases'

interface SutTypes {
  sut: ForgetPasswordTokenGenerator
  encrypterStub: Encrypter
  saveTokenRepositoryStub: SaveToken
}

const makeSaveTokenRepository = (): SaveToken => {
  class SaveTokenRepositoryStub implements SaveToken {
    async save (tokenData: SaveToken.Params): Promise<SaveToken.Result> {
      return await new Promise(resolve => { resolve(true) })
    }
  }
  return new SaveTokenRepositoryStub()
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => { resolve('any_token') })
    }
  }
  return new EncrypterStub()
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
    const token = await sut.generate(1)
    expect(token).toBeTruthy()
    expect(token).toHaveLength(6)
  })

  it('Should call Encrypter with correct value', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.generate(1)
    expect(encryptSpy).toBeCalled()
  })

  it('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promise = sut.generate(1)
    await expect(promise).rejects.toThrow()
  })

  it('Should call SaveTokenRepository with correct values', async () => {
    const { sut, saveTokenRepositoryStub } = makeSut()
    const saveTokenSpy = jest.spyOn(saveTokenRepositoryStub, 'save')
    await sut.generate(1)
    expect(saveTokenSpy).toHaveBeenCalledWith({ accountId: 1, token: 'any_token' })
  })

  it('Should throw if SaveTokenRepository throws', async () => {
    const { sut, saveTokenRepositoryStub } = makeSut()
    jest.spyOn(saveTokenRepositoryStub, 'save').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promise = sut.generate(1)
    await expect(promise).rejects.toThrow()
  })
})