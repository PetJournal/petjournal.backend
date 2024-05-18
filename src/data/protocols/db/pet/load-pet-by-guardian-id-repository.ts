import { type Pet } from '@/domain/models'

export interface LoadPetByGuardianIdRepository {
  load: (guardianId: LoadPetByGuardianIdRepository.Params) => Promise<LoadPetByGuardianIdRepository.Result>
}

export namespace LoadPetByGuardianIdRepository {
  export type Params = string

  export type Result = Pet[]
}
