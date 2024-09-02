import { type LoadGuardianByEmailRepository } from '@/data/protocols'
import { type Middleware } from '../protocols'
import { success, type HttpRequest, type HttpResponse } from '../helpers'

export class AccountConfirmationMiddleware implements Middleware {
  private readonly guardianRepository: LoadGuardianByEmailRepository

  constructor ({ guardianRepository }: AccountConfirmationMiddleware.Dependencies) {
    this.guardianRepository = guardianRepository
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { email } = httpRequest.body
    await this.guardianRepository.loadByEmail(email)

    return success(null)
  }
}

export namespace AccountConfirmationMiddleware {
  export interface Dependencies {
    guardianRepository: LoadGuardianByEmailRepository
  }
}
