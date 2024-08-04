import { EmailConfirmationController } from '@/application/controllers'
import { NotFoundError } from '@/application/errors'
import { badRequest } from '@/application/helpers'
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

  it('Should return 400 (BadRequest) if invalid userId is provided', async () => {
    const { sut, emailConfirmationStub } = makeSut()
    jest.spyOn(emailConfirmationStub, 'confirm').mockResolvedValueOnce({
      isSuccess: false,
      error: new NotFoundError('guardian')
    })
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new NotFoundError('guardian')))
  })
})
