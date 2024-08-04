import { type LoadGuardianByIdRepository, type UpdateEmailConfirmationRepository } from '@/data/protocols'

export interface EmailConfirmation {
  confirm: (userId: EmailConfirmation.Params) => Promise<EmailConfirmation.Result>
}

export namespace EmailConfirmation {
  export type Params = string
  export type Result = boolean | null
  export type Dependencies = {
    guardianRepository: LoadGuardianByIdRepository & UpdateEmailConfirmationRepository
  }
}
