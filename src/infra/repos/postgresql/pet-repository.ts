import { prisma as db } from '@/infra/repos/postgresql/prisma'

import { type LoadPetByGuardianIdRepository, type AddPetRepository } from '@/data/protocols'
import { type Pet } from '@/domain/models'

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
          castrated: params.castrated
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
          castrated: true
        }
      })
      return pet
    } catch (error) {
      return undefined
    }
  }

  async load (guardianId: LoadPetByGuardianIdRepository.Params): Promise<LoadPetByGuardianIdRepository.Result> {
    const pets = await db.pet.findMany({ where: { guardianId } })
    return pets as Pet[]
  }
}
