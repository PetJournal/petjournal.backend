import { type LoadBreedByNameRepository, type LoadSpecieByNameRepository } from '@/data/protocols'
import { type LoadSizeByNameRepository } from '@/data/protocols/db/size'
import { type Breed } from '@/domain/models/breed'
import { type Size } from '@/domain/models/size'
import { type Specie } from '@/domain/models/specie'

export interface AppointPet {
  appoint: (params: AppointPet.Params) => Promise<AppointPet.Result>
}

export namespace AppointPet {
  export interface Params {
    specieName: string
    breedName: string
    size: string
  }

  export interface Result {
    specie: Specie & { id: string }
    specieAlias: string | undefined
    breed: Breed & { id: string }
    breedAlias: string
    size: Size & { id: string }
  }

  export interface Dependencies {
    specieRepository: LoadSpecieByNameRepository
    breedRepository: LoadBreedByNameRepository
    sizeRepository: LoadSizeByNameRepository
  }
}