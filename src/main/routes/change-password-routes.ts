import { type Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { makeChangePasswordController } from '@/main/factories'
import { accountConfirmation, auth } from '@/main/middlewares'

export default (router: Router): void => {
  router.patch('/guardian/change-password', auth, accountConfirmation, adaptRoute(makeChangePasswordController()))
}
