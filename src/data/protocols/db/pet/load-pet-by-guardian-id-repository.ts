export interface LoadPetByGuardianIdRepository {
  load: (guardianId: LoadPetByGuardianIdRepository.Params) => Promise<LoadPetByGuardianIdRepository.Result>
}

export namespace LoadPetByGuardianIdRepository {
  export type Params = string

  export type Result = Array<{
    id: string
    guardianId: string
    specieId: string
    specieAlias: string | null
    petName: string
    gender: string
    breedAlias: string
    breed: {
      id: string
      name: string
    }
    size: {
      id: string
      name: string
    }
    castrated: boolean
  }>
}
