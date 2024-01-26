import { prisma as db } from '@/infra/repos/postgresql/prisma'
import { BreedRepository } from '@/infra/repos/postgresql'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'

beforeEach(async () => { await PrismaHelper.connect() })
afterEach(async () => { await PrismaHelper.disconnect() })

const makeSut = (): BreedRepository => {
  return new BreedRepository()
}

describe('BreedRepository', () => {
  describe('LoadByName method', () => {
    it('Should not return a breed if invalid name is provided', async () => {
      const sut = makeSut()
      const name = 'invalid_name'
      const result = await sut.loadByName(name)
      expect(result).toBeFalsy()
    })

    it('Should return an breed if valid name is provided', async () => {
      const sut = makeSut()
      const specieName = 'any_name'
      const specie = await db.specie.create({ data: { name: specieName } })
      const breed = {
        name: 'any_name',
        specieId: specie.id
      }
      await db.breed.create({ data: { name: breed.name, specieId: breed.specieId } })
      const result = await sut.loadByName(breed.name)
      expect(result).toBeTruthy()
      expect(result).toMatchObject({ name: 'any_name' })
    })
  })

  describe('LoadCatBreeds', () => {
    it('Should return a list of cat breeds', async () => {
      const sut = makeSut()
      const specieName = 'Gato'
      const specie = await db.specie.create({ data: { name: specieName } })
      const breeds = [
        {
          name: 'any_name_1',
          specieId: specie.id
        },
        {
          name: 'any_name_2',
          specieId: specie.id
        },
        {
          name: 'any_name_3',
          specieId: specie.id
        }
      ]
      await db.breed.createMany({ data: breeds })
      const result = await sut.loadCatBreeds()
      expect(result).toBeTruthy()
      expect(result).toEqual([
        {
          id: expect.any(String),
          name: 'any_name_3',
          specieId: specie.id
        },
        {
          id: expect.any(String),
          name: 'any_name_2',
          specieId: specie.id
        },
        {
          id: expect.any(String),
          name: 'any_name_1',
          specieId: specie.id
        }
      ])
    })
  })
  describe('LoadDogBreeds', () => {
    it('Should return a list of dog breeds', async () => {
      const sut = makeSut()
      const specieName = 'Cachorro'
      const specie = await db.specie.create({ data: { name: specieName } })
      const breeds = [
        {
          name: 'any_name_1',
          specieId: specie.id
        },
        {
          name: 'any_name_2',
          specieId: specie.id
        },
        {
          name: 'any_name_3',
          specieId: specie.id
        }
      ]
      await db.breed.createMany({ data: breeds })
      const result = await sut.loadDogBreeds()
      expect(result).toBeTruthy()
      expect(result).toEqual([
        {
          id: expect.any(String),
          name: 'any_name_3',
          specieId: specie.id
        },
        {
          id: expect.any(String),
          name: 'any_name_2',
          specieId: specie.id
        },
        {
          id: expect.any(String),
          name: 'any_name_1',
          specieId: specie.id
        }
      ])
    })
  })
})