import app from '@/main/config/app'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'
import request from 'supertest'

describe('LoadCatBreeds route', () => {
  beforeEach(async () => { await PrismaHelper.connect() })
  afterEach(async () => { await PrismaHelper.disconnect() })

  it('Should return 200 on success', async () => {
    await request(app)
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
    const { body } = await request(app)
      .post('/api/login')
      .send({
        email: 'johndoe@email.com',
        password: 'Teste@123'
      })

    await request(app)
      .get('/api/breeds/cat')
      .set('Authorization', `Bearer ${body.accessToken as string}`)
      .expect(200)
  })
})
