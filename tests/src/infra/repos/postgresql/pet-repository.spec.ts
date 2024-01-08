import { PetGender } from '@/domain/models/pet'
import { PetRepository } from '@/infra/repos/postgresql'
import { prisma as db } from '@/infra/repos/postgresql/prisma'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'

beforeEach(async () => { await PrismaHelper.connect() })

afterEach(async () => { await PrismaHelper.disconnect() })

const makeSut = (): PetRepository => {
  return new PetRepository()
}

describe('PetRepository', () => {
  it('Should not return a pet if invalid data is provided', async () => {
    const sut = makeSut()
    const data = {
      guardianId: 'invalid_guardian_id',
      specieId: 'invalid_specie_id',
      specieAlias: 'invalid_specie_alias',
      petName: 'invalid_pet_name',
      gender: 'invalid_gender' as PetGender,
      breedId: 'invalid_breed_id',
      breedAlias: 'invalid_breed_alias',
      sizeId: 'invalid_size_id'
    }

    const specie = await sut.add(data)

    expect(specie).toBeFalsy()
  })

  it('Should return a pet if valid data is provided', async () => {
    const sut = makeSut()
    const guardian = await db.guardian.create({
      data: {
        firstName: 'any_first_name',
        lastName: 'any_last_name',
        email: 'any_email',
        password: 'any_password',
        phone: 'any_phone',
        verificationToken: 'any_token'
      }
    })
    const specieFK = await db.specie.create({
      data: {
        name: 'any_name'
      }
    })
    const breed = await db.breed.create({
      data: {
        name: 'any_name',
        specieId: specieFK.id
      }
    })
    const size = await db.size.create({
      data: {
        name: 'any_name',
        specieId: specieFK.id
      }
    })
    const data = {
      guardianId: guardian.id,
      specieId: specieFK.id,
      specieAlias: 'any_specie_alias',
      petName: 'any_pet_name',
      gender: PetGender.MALE,
      breedId: breed.id,
      breedAlias: 'any_breed_alias',
      sizeId: size.id
    }

    const specie = await sut.add(data)

    expect(specie).toBeTruthy()
    expect(specie).toMatchObject({
      guardian: {
        firstName: guardian.firstName,
        lastName: guardian.lastName,
        email: guardian.email,
        phone: guardian.phone
      },
      specie: {
        ...specieFK
      },
      petName: data.petName,
      gender: data.gender,
      specieAlias: data.specieAlias,
      breed: {
        id: breed.id,
        name: breed.name
      },
      breedAlias: data.breedAlias,
      size: {
        id: size.id,
        name: size.name
      }
    })
  })
})
