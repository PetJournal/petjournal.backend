import { type EmailConfirmation } from '@/domain/use-cases'
import { type Controller } from '../protocols'
import { type HttpRequest, type HttpResponse, serverError, success, unauthorized } from '../helpers'

export class EmailConfirmationController implements Controller {
  private readonly emailConfirmation: EmailConfirmation

  constructor ({ emailConfirmation }: EmailConfirmationController.Dependencies) {
    this.emailConfirmation = emailConfirmation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const userId = httpRequest.params.userId
      const emailConfirmation = await this.emailConfirmation.confirm(userId)
      if (!emailConfirmation) {
        return unauthorized()
      }
      return success(emailConfirmation)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace EmailConfirmationController {
  export type Dependencies = {
    emailConfirmation: EmailConfirmation
  }
}
