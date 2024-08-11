import { type EmailService } from '@/data/protocols'

export interface SendEmail {
  send: (data: SendEmail.Params) => Promise<SendEmail.Result>
}

export namespace SendEmail {
  export type Params = {
    email: string
  }

  export type Result = boolean

  export type Dependencies = {
    emailService: EmailService
  }
}
