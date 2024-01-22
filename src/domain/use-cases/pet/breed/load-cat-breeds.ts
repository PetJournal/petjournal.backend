import { type LoadCatBreedsRepository } from '@/data/protocols/db/breed'
import { type Breed } from '@/domain/models/breed'

export interface LoadCatBreeds {
  load: () => Promise<LoadCatBreeds.Result>
}

export namespace LoadCatBreeds {
  export type Result = Breed[]
  export type Dependencies = {
    breedRepository: LoadCatBreedsRepository
  }
}