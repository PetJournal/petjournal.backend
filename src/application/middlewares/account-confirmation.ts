import { type LoadGuardianByEmailRepository } from '@/data/protocols'
import { type Middleware } from '../protocols'
import { serverError, success, unauthorized, type HttpRequest, type HttpResponse } from '../helpers'
import { EmailConfirmationError, NotFoundError } from '../errors'

export class AccountConfirmationMiddleware implements Middleware {
  private readonly guardianRepository: LoadGuardianByEmailRepository

  constructor ({ guardianRepository }: AccountConfirmationMiddleware.Dependencies) {
    this.guardianRepository = guardianRepository
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email } = httpRequest.body
      const guardian = await this.guardianRepository.loadByEmail(email)
      if (!guardian) {
        return unauthorized(new NotFoundError('User not found'))
      }

      if (!guardian.emailConfirmation) {
        return unauthorized(new EmailConfirmationError('your email are not confirmed'))
      }

      return success(null)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace AccountConfirmationMiddleware {
  export interface Dependencies {
    guardianRepository: LoadGuardianByEmailRepository
  }
}
