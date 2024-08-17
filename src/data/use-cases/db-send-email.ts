import { type SendEmail } from '@/domain/use-cases'
import { type EmailService, type LoadGuardianByEmailRepository } from '../protocols'
import env from '@/main/config/env'

export class DbSendEmail implements SendEmail {
  private readonly guardianRepository: LoadGuardianByEmailRepository
  private readonly emailService: EmailService

  constructor ({ guardianRepository, emailService }: SendEmail.Dependencies) {
    this.guardianRepository = guardianRepository
    this.emailService = emailService
  }

  async send ({ email }: SendEmail.Params): Promise<SendEmail.Result> {
    const guardian = await this.guardianRepository.loadByEmail(email)
    if (!guardian) {
      throw new Error('Guardian not found')
    }

    await this.emailService.send({
      from: 'contato.petjournal@gmail.com',
      to: guardian.email,
      subject: 'Ative sua conta',
      text: `
          Olá ${guardian.firstName} ${guardian.lastName},\n
          Acesse o link para ativar sua conta: http://localhost:${env.port}/api/guardian/email-confirmation/${guardian.id}
        `
    })
  }
}
