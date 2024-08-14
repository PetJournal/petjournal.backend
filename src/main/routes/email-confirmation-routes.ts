import { type Router } from 'express'
import { adaptRoute } from '../adapters'
import { makeEmailConfirmationController } from '../factories'

export default (router: Router): void => {
  router.patch('/guardian/email-confirmation/:userId', adaptRoute(makeEmailConfirmationController()))
}