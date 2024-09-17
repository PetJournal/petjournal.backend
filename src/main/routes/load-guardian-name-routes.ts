import { type Router } from 'express'
import { accountConfirmation, auth } from '@/main/middlewares'
import { makeLoadGuardianNameController } from '@/main/factories/controllers'
import { adaptRoute } from '@/main/adapters'

export default (router: Router): void => {
  router.get('/guardian/name', auth, accountConfirmation, adaptRoute(makeLoadGuardianNameController()))
}
