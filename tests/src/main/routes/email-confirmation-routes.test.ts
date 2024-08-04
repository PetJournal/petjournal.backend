import app from '@/main/config/app'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'
import request from 'supertest'

describe('EmailConfirmation route', () => {
  beforeEach(async () => { await PrismaHelper.connect() })

  afterEach(async () => { await PrismaHelper.disconnect() })

  it('Should return 200 on success', async () => {
    const user = await request(app)
      .post('/api/signup')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@email.com',
        password: 'Teste@123',
        passwordConfirmation: 'Teste@123',
        phone: '11987654321',
        isPrivacyPolicyAccepted: true
      })

    await request(app)
      .patch(`/api/guardian/email-confirmation/${user.body.id as string}`)
      .expect(200)
  })
})
