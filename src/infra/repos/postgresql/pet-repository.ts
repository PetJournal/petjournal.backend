import { prisma as db } from '@/infra/repos/postgresql/prisma'
import { type LoadPetByGuardianIdRepository, type AddPetRepository } from '@/data/protocols'

export class PetRepository implements AddPetRepository, LoadPetByGuardianIdRepository {
  async add (params: AddPetRepository.Params): Promise<AddPetRepository.Result> {
    try {
      const pet = await db.pet.create({
        data: {
          guardianId: params.guardianId,
          specieId: params.specieId,
          specieAlias: params.specieAlias,
          petName: params.petName,
          gender: params.gender,
          breedId: params.breedId,
          breedAlias: params.breedAlias,
          sizeId: params.sizeId,
          castrated: params.castrated,
          dateOfBirth: params.dateOfBirth
        },
        select: {
          id: true,
          specieAlias: true,
          guardian: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true
            }
          },
          specie: true,
          petName: true,
          gender: true,
          breed: true,
          breedAlias: true,
          size: true,
          castrated: true,
          dateOfBirth: true
        }
      })
      return pet
    } catch (error) {
      return undefined
    }
  }

  async load (guardianId: LoadPetByGuardianIdRepository.Params): Promise<LoadPetByGuardianIdRepository.Result> {
    const pets = await db.pet.findMany({
      where: { guardianId },
      select: {
        id: true,
        guardianId: true,
        specie: {
          select: {
            id: true,
            name: true
          }
        },
        specieAlias: true,
        petName: true,
        gender: true,
        breedAlias: true,
        breed: {
          select: {
            id: true,
            name: true
          }
        },
        size: {
          select: {
            id: true,
            name: true
          }
        },
        castrated: true,
        dateOfBirth: true
      }
    })
    return pets
  }
}
