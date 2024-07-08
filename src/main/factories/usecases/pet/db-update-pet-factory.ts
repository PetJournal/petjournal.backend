import { DbUpdatePet } from '@/data/use-cases'
import { type UpdatePet } from '@/domain/use-cases'
import { GuardianAccountRepository, PetRepository } from '@/infra/repos/postgresql'
import { makeDbAppointPet } from './db-appoint-pet-factory'

export const makeDbUpdatePet = (): UpdatePet => {
  const guardianRepository = new GuardianAccountRepository()
  const petRepository = new PetRepository()
  const appointPet = makeDbAppointPet()
  const dependencies: UpdatePet.Dependencies = {
    guardianRepository,
    petRepository,
    appointPet
  }
  const updatePet = new DbUpdatePet(dependencies)
  return updatePet
}
