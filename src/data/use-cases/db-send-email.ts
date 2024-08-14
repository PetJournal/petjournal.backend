import { type SendEmail } from '@/domain/use-cases'
import { type LoadGuardianByEmailRepository } from '../protocols'

export class DbSendEmail implements SendEmail {
  private readonly guardianService: LoadGuardianByEmailRepository

  constructor ({ guardianService }: SendEmail.Dependencies) {
    this.guardianService = guardianService
  }

  async send ({ email }: SendEmail.Params): Promise<SendEmail.Result> {
    await this.guardianService.loadByEmail(email)
  }
}
