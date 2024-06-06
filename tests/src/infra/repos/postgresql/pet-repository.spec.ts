import { PetGender } from '@/domain/models/pet'
import { PetRepository } from '@/infra/repos/postgresql'
import { prisma as db } from '@/infra/repos/postgresql/prisma'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'
import { getCombinations } from '@/tests/utils/algorithms'

beforeEach(async () => { await PrismaHelper.connect() })

afterEach(async () => { await PrismaHelper.disconnect() })

const makeSut = (): PetRepository => {
  return new PetRepository()
}

describe('PetRepository', () => {
  describe('AddPet method', () => {
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
        sizeId: 'invalid_size_id',
        castrated: false
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
        sizeId: size.id,
        castrated: false
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

  describe('UpdatePet method', () => {
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
        sizeId: 'invalid_size_id',
        castrated: false
      }

      const specie = await sut.add(data)

      expect(specie).toBeFalsy()
    })

    it.only('Should return a pet if valid data is provided', async () => {
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
      const breed2 = await db.breed.create({
        data: {
          name: 'any_name2',
          specieId: specieFK.id
        }
      })
      const size = await db.size.create({
        data: {
          name: 'any_name',
          specieId: specieFK.id
        }
      })
      const size2 = await db.size.create({
        data: {
          name: 'any_name2',
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
        sizeId: size.id,
        castrated: false
      }

      const createdPet = await db.pet.create({ data })
      const { id, ...pet } = createdPet

      const combinations = {
        petName: 'Jose',
        gender: 'F',
        breedAlias: 'Caramelo',
        breedId: breed2.id,
        sizeId: size2.id,
      }
      for (const combination of getCombinations(combinations)) {
        const updatedPet = await sut.update({
          petId: createdPet.id as string,
          ...pet,
          ...combination
        })

        const copyCombination = { ...combination }
        delete combination.breedId
        delete combination.sizeId

        expect(updatedPet).toMatchObject({
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
            id: Object.hasOwn(copyCombination, 'breedId') ? breed2.id : breed.id,
            name: Object.hasOwn(copyCombination, 'breedId') ? breed2.name : breed.name
          },
          breedAlias: data.breedAlias,
          size: {
            id: Object.hasOwn(copyCombination, 'sizeId') ? size2.id : size.id,
            name: Object.hasOwn(copyCombination, 'sizeId') ? size2.name : size.name
          },
          ...combination
        })
    }
    })
  })

  describe('LoadPets method', () => {
    it('Should return a list of pets', async () => {
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
        sizeId: size.id,
        castrated: false
      }

      await sut.add(data)
      const result = await sut.load(data.guardianId)
      expect(result).toEqual([{
        id: expect.any(String),
        breed: {
          id: expect.any(String),
          name: 'any_name'
        },
        breedAlias: 'any_breed_alias',
        castrated: false,
        gender: 'M',
        guardianId: expect.any(String),
        petName: 'any_pet_name',
        size: {
          id: expect.any(String),
          name: 'any_name'
        },
        specieAlias: 'any_specie_alias',
        specie: {
          id: expect.any(String),
          name: 'any_name'
        }
      }])
    })

    it('Should LoadPets method return an empty array if there are no pets registered', async () => {
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
      const result = await sut.load(guardian.id)
      expect(result).toEqual([])
    })
  })
})
