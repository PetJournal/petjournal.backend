import { type Controller } from '@/application/protocols'
import { SignUpController } from '@/application/controllers'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { DevLoggerControllerDecorator, LoggerControllerDecorator } from '@/main/decorators'
import { makeSignUpValidation, makeDbAddGuardian } from '@/main/factories'
import { type SendEmail } from '@/domain/use-cases'

export const makeSignUpController = (): Controller => {
  const addGuardian = makeDbAddGuardian()
  const validation = makeSignUpValidation()
  const sendEmail: SendEmail = {
    send: async () => {}
  }
  const dependencies: SignUpController.Dependencies = {
    addGuardian,
    validation,
    sendEmail
  }
  const signUpController = new SignUpController(dependencies)
  const loggerPgRepository = new LoggerPgRepository()
  const loggerControllerDecorator = new LoggerControllerDecorator(signUpController, loggerPgRepository)
  return new DevLoggerControllerDecorator(loggerControllerDecorator)
}
