import { type Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { auth } from '@/main/middlewares'
import { makeLoadPetsController, makePetRegistryController } from '@/main/factories'

export default (router: Router): void => {
  router.get('/pet', auth, adaptRoute(makeLoadPetsController()))
  router.post('/pet', auth, adaptRoute(makePetRegistryController()))
}
