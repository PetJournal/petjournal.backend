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
})
