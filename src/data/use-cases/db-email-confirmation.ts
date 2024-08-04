import { type EmailConfirmation } from '@/domain/use-cases/email-confirmation'
import { type UpdateEmailConfirmationRepository, type LoadGuardianByIdRepository } from '../protocols'

export class DbEmailConfirmation implements EmailConfirmation {
  private readonly guardianRepository: LoadGuardianByIdRepository & UpdateEmailConfirmationRepository

  constructor ({ guardianRepository }: EmailConfirmation.Dependencies) {
    this.guardianRepository = guardianRepository
  }

  async confirm (userId: EmailConfirmation.Params): Promise<EmailConfirmation.Result> {
    const guardian = await this.guardianRepository.loadById(userId)
    if (!guardian) {
      return null
    }
    const emailConfirmed = await this.guardianRepository.updateEmailConfirmation(userId)
    return emailConfirmed
  }
}
