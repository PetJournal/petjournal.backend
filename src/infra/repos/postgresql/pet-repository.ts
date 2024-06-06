import { prisma as db } from '@/infra/repos/postgresql/prisma'
import { type LoadPetByGuardianIdRepository, type AddPetRepository, type UpdatePetRepository } from '@/data/protocols'

export class PetRepository implements AddPetRepository, LoadPetByGuardianIdRepository, UpdatePetRepository {
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

  async update(params: UpdatePetRepository.Params): Promise<UpdatePetRepository.Result> {
    const { petId, ...updateData } = params
    const pet = await db.pet.update({
      data: updateData,
      where: {
        id: petId
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
        castrated: true
      }
    })
    return pets
  }
}
