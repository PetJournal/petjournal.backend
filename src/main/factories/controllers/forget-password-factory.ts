import { ForgetPasswordController } from '@/application/controllers/forget-password'
import { EmailValidatorAdapter } from '@/application/validation/validators'
import { DbForgetPassword } from '@/data/use-cases'
import { ForgetPasswordTokenGenerator } from '@/data/use-cases/forget-password-token-generation'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter'
import { NodeMailerAdapter } from '@/infra/node-mailer-adapter'
import { GuardianAccountRepository } from '@/infra/repos/postgresql/guardian-account-repository'
import env from '@/main/config/env'

export const makeForgetPasswordController = (): ForgetPasswordController => {
  const emailValidator = new EmailValidatorAdapter()
  const loadGuardianByEmailRepository = new GuardianAccountRepository()
  const salt = Number(env.salt)
  const bcryptAdapter = new BcryptAdapter(salt)
  const saveTokenRepository = new GuardianAccountRepository()
  const tokenGenerator = new ForgetPasswordTokenGenerator(bcryptAdapter, saveTokenRepository)
  const transporter = {
    service: 'gmail',
    auth: {
      user: env.mailUser,
      pass: env.mailPass
    }
  }
  const nodeMailerAdapter = new NodeMailerAdapter(transporter)
  const dbForgetPassword = new DbForgetPassword({ loadGuardianByEmailRepository, tokenGenerator, emailService: nodeMailerAdapter })
  const dependencies: ForgetPasswordController.Dependencies = {
    emailValidator,
    forgetPassword: dbForgetPassword
  }
  return new ForgetPasswordController(dependencies)
}
