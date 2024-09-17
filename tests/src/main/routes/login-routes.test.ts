import request from 'supertest'
import app from '@/main/config/app'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'

beforeEach(async () => { await PrismaHelper.connect() })

afterEach(async () => { await PrismaHelper.disconnect() })

describe('Login Routes', () => {
  it('Should return an access token on success', async () => {
    const responseSignup = await request(app)
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

    await request(app).get(`/api/guardian/email-confirmation/${responseSignup.body.id as string}`)

    const response = await request(app)
      .post('/api/login')
      .send({
        email: 'johndoe@email.com',
        password: 'Teste@123'
      })

    expect(response.status).toBe(200)
    expect(response.body.accessToken).toBeTruthy()
  })
})
