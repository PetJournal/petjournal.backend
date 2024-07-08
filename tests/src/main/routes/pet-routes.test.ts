import app from '@/main/config/app'
import { PrismaHelper, prisma } from '@/tests/helpers/prisma-helper'
import request from 'supertest'

beforeEach(async () => { await PrismaHelper.connect() })

afterEach(async () => { await PrismaHelper.disconnect() })

interface FakeUser {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

const makeSetup = async (): Promise<{ accessToken: string, fakeUser: FakeUser }> => {
  const resSignUp = await request(app)
    .post('/api/signup')
    .send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@email.com',
      password: 'Test@123',
      passwordConfirmation: 'Test@123',
      phone: '11987654321',
      isPrivacyPolicyAccepted: true
    })

  const resLogin = await request(app)
    .post('/api/login')
    .send({
      email: 'johndoe@email.com',
      password: 'Test@123'
    })

  await prisma.specie.createMany({
    data: [
      { name: 'Cachorro' },
      { name: 'Outros' }
    ]
  })

  const cachorro = await prisma.specie.findUnique({ where: { name: 'Cachorro' } })
  const outros = await prisma.specie.findUnique({ where: { name: 'Outros' } })

  await prisma.breed.create({
    data:
      {
        name: 'Afghan Hound',
        specieId: cachorro?.id as string
      }
  })

  await prisma.breed.create({
    data:
      {
        name: 'Sem raça Cachorro',
        specieId: cachorro?.id as string
      }
  })

  await prisma.breed.create({
    data:
      {
        name: 'Sem raça',
        specieId: outros?.id as string
      }
  })

  await prisma.size.create({
    data:
      {
        name: 'Mini (Até 6Kg)',
        specieId: cachorro?.id as string
      }
  })

  await prisma.size.create({
    data:
      {
        name: 'Pequeno (6 à 14Kg)',
        specieId: cachorro?.id as string
      }
  })

  await prisma.size.create({
    data:
      {
        name: 'Sem porte',
        specieId: outros?.id as string
      }
  })

  return { accessToken: resLogin.body.accessToken, fakeUser: resSignUp.body }
}

describe('POST - /api/pet Route', () => {
  it.each([
    [{ specieName: 'Cachorro', petName: 'any pet name', gender: 'M', breedName: 'Afghan Hound', size: 'Mini (Até 6Kg)', dateOfBirth: '2024-06-05T23:40:42.628Z', castrated: false }, { status: 201, body: { specie: { name: 'Cachorro' }, specieAlias: null, petName: 'any pet name', gender: 'M', breed: { name: 'Afghan Hound' }, size: { name: 'Mini (Até 6Kg)' }, dateOfBirth: '2024-06-05T23:40:42.628Z', castrated: false } }],
    [{ specieName: 'Inseto', petName: 'any pet name', gender: 'M', breedName: 'Sem raça', size: 'Sem porte', dateOfBirth: '2000-11-23T02:00:00.000Z', castrated: true }, { status: 201, body: { specie: { name: 'Outros' }, specieAlias: 'Inseto', petName: 'any pet name', gender: 'M', breed: { name: 'Sem raça' }, size: { name: 'Sem porte' }, dateOfBirth: '2000-11-23T02:00:00.000Z', castrated: false } }],
    [{ specieName: 'Cachorro', petName: 'any pet name', gender: 'F', breedName: 'Sem raça Cachorro', size: 'Pequeno (6 à 14Kg)', dateOfBirth: '2018-05-10T02:00:00.000Z', castrated: false }, { status: 201, body: { specie: { name: 'Cachorro' }, specieAlias: null, petName: 'any pet name', gender: 'F', breed: { name: 'Sem raça Cachorro' }, size: { name: 'Pequeno (6 à 14Kg)' }, dateOfBirth: '2018-05-10T02:00:00.000Z', castrated: false } }]
  ])("When data is '%s' should return '%s' when the pet is successfully created", async (data, res) => {
    const { accessToken, fakeUser } = await makeSetup()
    const response = await request(app)
      .post('/api/pet')
      .set('Authorization', accessToken)
      .send(data)

    expect(response.status).toBe(res.status)
    expect(response.body).toEqual({
      id: expect.any(String),
      guardian: fakeUser,
      specie: {
        id: expect.any(String),
        name: res.body.specie.name
      },
      specieAlias: res.body.specieAlias,
      petName: res.body.petName,
      gender: res.body.gender,
      breed: {
        id: expect.any(String),
        name: res.body.breed.name,
        specieId: expect.any(String)
      },
      breedAlias: '',
      size: {
        id: expect.any(String),
        name: res.body.size.name,
        specieId: expect.any(String)
      },
      castrated: res.body.castrated,
      dateOfBirth: res.body.dateOfBirth
    })
  })
})

describe('GET - /api/pet Route', () => {
  it('ensure return a list of pets', async () => {
    const { accessToken } = await makeSetup()
    await request(app)
      .post('/api/pet')
      .set('Authorization', accessToken)
      .send({
        specieName: 'Cachorro',
        petName: 'any pet name',
        gender: 'M',
        breedName: 'Afghan Hound',
        size: 'Mini (Até 6Kg)',
        dateOfBirth: '2024-06-05T23:40:42.628Z',
        castrated: true
      })

    const response = await request(app)
      .get('/api/pet')
      .set('Authorization', accessToken)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toStrictEqual([{
      id: expect.any(String),
      guardianId: expect.any(String),
      specie: {
        id: expect.any(String),
        name: 'Cachorro'
      },
      specieAlias: null,
      petName: 'any pet name',
      gender: 'M',
      breedAlias: '',
      breed: {
        id: expect.any(String),
        name: 'Afghan Hound'
      },
      size: {
        id: expect.any(String),
        name: 'Mini (Até 6Kg)'
      },
      castrated: true,
      dateOfBirth: '2024-06-05T23:40:42.628Z'
    }])
  })

  it('ensure return an empty array if there are not pets registered', async () => {
    const { accessToken } = await makeSetup()
    const response = await request(app)
      .get('/api/pet')
      .set('Authorization', accessToken)
      .send()

    expect(response.status).toBe(200)
    expect(response.body).toEqual([])
  })
})

describe('PUT - /api/pet/:petId Route', () => {
  it('ensure update a pet', async () => {
    const { accessToken } = await makeSetup()
    const pet = await request(app)
      .post('/api/pet')
      .set('Authorization', accessToken)
      .send({
        specieName: 'Cachorro',
        petName: 'any pet name',
        gender: 'M',
        breedName: 'Afghan Hound',
        size: 'Mini (Até 6Kg)',
        dateOfBirth: '2024-06-05T23:40:42.628Z',
        castrated: true
      })

    const response = await request(app)
      .put(`/api/pet/${pet.body.id as string}`)
      .set('Authorization', accessToken)
      .send({
        petName: 'pet name updated'
      })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      id: expect.any(String),
      guardian: {
        id: expect.any(String),
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@email.com',
        phone: '11987654321'
      },
      specie: {
        id: expect.any(String),
        name: 'Cachorro'
      },
      specieAlias: null,
      petName: 'pet name updated',
      gender: 'M',
      breedAlias: '',
      breed: {
        id: expect.any(String),
        name: 'Afghan Hound',
        specieId: expect.any(String)
      },
      size: {
        id: expect.any(String),
        name: 'Mini (Até 6Kg)',
        specieId: expect.any(String)
      },
      castrated: true,
      dateOfBirth: '2024-06-05T23:40:42.628Z'
    })
  })

  it('Should return 400 if no access token is provided', async () => {
    await makeSetup()
    await request(app)
      .put('/api/pet/any_id')
      .set('Authorization', '')
      .expect(400)
  })

  it('Should return 406 (NotAcceptable) if invalid petId is Provided', async () => {
    const { accessToken } = await makeSetup()
    await request(app)
      .put('/api/pet/invalid_pet_id')
      .set('Authorization', accessToken)
      .expect(406)
  })
})
