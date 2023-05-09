import { LoginController } from '@/application/controllers/login'
import { EmailValidatorAdapter } from '@/application/validation/validators'
import { DbAuthentication } from '@/data/use-cases'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter'
import { JwtAdapter } from '@/infra/criptography/jwt-adapter'
import { GuardianAccountRepository } from '@/infra/repos/postgresql/guardian-account-repository'

export const makeLoginController = (): LoginController => {
  const salt = 12
  const secret = 'any_secret'
  const hashComparer = new BcryptAdapter(salt)
  const tokenGenerator = new JwtAdapter(secret)
  const emailValidator = new EmailValidatorAdapter()
  const loadAccountByEmailRepository = new GuardianAccountRepository()
  const updateAccessTokenRepository = new GuardianAccountRepository()
  const authentication = new DbAuthentication(loadAccountByEmailRepository, hashComparer, tokenGenerator, updateAccessTokenRepository)
  return new LoginController(emailValidator, authentication)
}
