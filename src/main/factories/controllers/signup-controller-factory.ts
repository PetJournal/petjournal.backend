import { EmailValidatorAdapter, NameValidatorAdapter, PasswordValidatorAdapter, PhoneValidatorAdapter } from '@/application/validation/validators'
import { SignUpController } from '@/application/controllers/signup'
import { DbAddGuardian } from '@/data/use-cases/db-add-guardian'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter'
import { GuardianAccountRepository } from '@/infra/repos/postgresql/guardian-account-repository'

export const makeSignUpController = (): SignUpController => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const guardianAccountRepository = new GuardianAccountRepository()
  const dbAddGuardian = new DbAddGuardian(guardianAccountRepository, bcryptAdapter)
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const nameValidatorAdapter = new NameValidatorAdapter()
  const passwordValidatorAdapter = new PasswordValidatorAdapter()
  const phoneValidatorAdapter = new PhoneValidatorAdapter()
  return new SignUpController(dbAddGuardian, emailValidatorAdapter, nameValidatorAdapter, passwordValidatorAdapter, phoneValidatorAdapter)
}