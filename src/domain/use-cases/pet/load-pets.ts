import { type LoadPetByGuardianIdRepository } from '@/data/protocols/db/pet'
import { type Pet } from '@/domain/models'

export interface LoadPets {
  load: (guardianId: LoadPets.Params) => Promise<LoadPets.Result>
}

export namespace LoadPets {
  export type Params = {
    guardianId: string
  }

  export type Result = Pet[] | undefined

  export type Dependencies = {
    petRepository: LoadPetByGuardianIdRepository
  }
}
