import { EmailConfirmationController } from '@/application/controllers'
import { type EmailConfirmation } from '@/domain/use-cases'
import { makeFakeEmailConfirmationRequest, makeFakeEmailConfirmationUseCase } from '@/tests/utils'

interface SutTypes {
  sut: EmailConfirmationController
  emailConfirmationStub: EmailConfirmation
}

const makeSut = (): SutTypes => {
  const emailConfirmationStub = makeFakeEmailConfirmationUseCase()
  const sut = new EmailConfirmationController({ emailConfirmation: emailConfirmationStub })
  return {
    sut,
    emailConfirmationStub
  }
}
describe('EmailConfirmation Controller', () => {
  const httpRequest = makeFakeEmailConfirmationRequest()
  it('Should call emailConfirmation with correct value', async () => {
    const { sut, emailConfirmationStub } = makeSut()
    const confirmSpy = jest.spyOn(emailConfirmationStub, 'confirm')
    await sut.handle(httpRequest)
    expect(confirmSpy).toHaveBeenCalledWith('any_id')
  })
})
