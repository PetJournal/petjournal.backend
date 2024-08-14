import { type LoadGuardianByEmailRepository } from '@/data/protocols'
import { DbSendEmail } from '@/data/use-cases'
import { makeFakeGuardianRepository } from '@/tests/utils'

interface SutTypes {
  sut: DbSendEmail
  guardianRepositoryStub: LoadGuardianByEmailRepository
}

const makeSut = (): SutTypes => {
  const guardianRepositoryStub = makeFakeGuardianRepository()
  const sut = new DbSendEmail({ guardianService: guardianRepositoryStub })
  return {
    sut,
    guardianRepositoryStub
  }
}

describe('DbSendEmail', () => {
  const data = { email: 'any_email' }

  it('Should call GuardianRepository with correct value', async () => {
    const { sut, guardianRepositoryStub } = makeSut()
    const loadByEmailSpy = jest.spyOn(guardianRepositoryStub, 'loadByEmail')
    await sut.send(data)
    expect(loadByEmailSpy).toHaveBeenCalledWith('any_email')
  })

  it('Should throw if GuardianRepository throws', async () => {
    const { sut, guardianRepositoryStub } = makeSut()
    jest.spyOn(guardianRepositoryStub, 'loadByEmail').mockRejectedValueOnce(new Error())
    const promise = sut.send(data)
    await expect(promise).rejects.toThrow()
  })
})
