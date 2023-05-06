import { GuardianAccountRepository } from '@/infra/repos/postgresql/guardian-account-repository'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'

beforeEach(() => { PrismaHelper.connect() })

afterEach(async () => { await PrismaHelper.disconnect() })

interface GuardianData {
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
  isPrivacyPolicyAccepted: boolean
}

const makeSut = (): GuardianAccountRepository => {
  return new GuardianAccountRepository()
}

const makeFakeGuardianData = (): GuardianData => ({
  firstName: 'valid_first_name',
  lastName: 'valid_last_name',
  email: 'valid_email',
  password: 'valid_password',
  phone: 'valid_phone',
  isPrivacyPolicyAccepted: true
})

describe('GuardianAccountRepository', () => {
  it('Should return a guardian account on success ', async () => {
    const sut = makeSut()
    const isValid = await sut.add(makeFakeGuardianData())
    expect(isValid).toBe(true)
  })

  it('Should not return a guardian account if duplicated email or phone is provided', async () => {
    const sut = makeSut()
    const firstAttempt = await sut.add(makeFakeGuardianData())
    const secondAttempt = await sut.add(makeFakeGuardianData())
    expect(firstAttempt).toBe(true)
    expect(secondAttempt).toBe(false)
  })

  it('Should return a guardian when calling the loadByEmail method', async () => {
    const sut = makeSut()
    await sut.add(makeFakeGuardianData())
    const guardian = await sut.loadByEmail('valid_email')
    expect(guardian).toBeTruthy()
    expect(guardian).toEqual({
      id: expect.any(Number),
      firstName: 'valid_first_name',
      lastName: 'valid_last_name',
      email: 'valid_email',
      password: 'valid_password',
      phone: 'valid_phone',
      isPrivacyPolicyAccepted: true,
      forgetPasswordToken: null
    })
  })

  it('Should call the saveToken method and return false if the guardian is not found', async () => {
    const sut = makeSut()
    const isValid = await sut.saveToken(1, 'valid_token')
    expect(isValid).toBe(false)
  })

  it('Should call the saveToken method and return true if the guardian is found', async () => {
    const sut = makeSut()
    await sut.add(makeFakeGuardianData())
    const guardian = await sut.loadByEmail('valid_email')
    if (guardian) {
      const isValid = await sut.saveToken(guardian.id, 'valid_token')
      expect(isValid).toBe(true)
    }
  }
  )
})
