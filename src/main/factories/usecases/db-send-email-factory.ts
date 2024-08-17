import { DbSendEmail } from '@/data/use-cases'
import { type SendEmail } from '@/domain/use-cases'
import { NodeMailerAdapter } from '@/infra/communication'
import { GuardianAccountRepository } from '@/infra/repos/postgresql'
import env from '@/main/config/env'

export const makeDbSendEmail = (): SendEmail => {
  const auth = { user: env.mailUser, pass: env.mailPass }
  const service = env.mailService
  const transporter = { service, auth }
  const emailService = new NodeMailerAdapter(transporter)
  const guardianRepository = new GuardianAccountRepository()
  return new DbSendEmail({ emailService, guardianRepository })
}
