import { DbSendEmail } from '@/data/use-cases'
import { makeFakeGuardianRepository } from '@/tests/utils'

describe('DbSendEmail', () => {
  it('Should call GuardianRepository with correct value', async () => {
    const guardianRepositoryStub = makeFakeGuardianRepository()
    const sut = new DbSendEmail({ guardianService: guardianRepositoryStub })
    const loadByEmailSpy = jest.spyOn(guardianRepositoryStub, 'loadByEmail')
    await sut.send({ email: 'any_email' })
    expect(loadByEmailSpy).toHaveBeenCalledWith('any_email')
  })

  it('Should throw if GuardianRepository throws', async () => {
    const guardianRepositoryStub = makeFakeGuardianRepository()
    const sut = new DbSendEmail({ guardianService: guardianRepositoryStub })
    jest.spyOn(guardianRepositoryStub, 'loadByEmail').mockRejectedValueOnce(new Error())
    const promise = sut.send({ email: 'any_email' })
    await expect(promise).rejects.toThrow()
  })
})
