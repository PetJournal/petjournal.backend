import { type Guardian, type GuardianWithId } from '../types'

const makeFakeGuardianData = (): Guardian => ({
  firstName: 'valid_first_name',
  lastName: 'valid_last_name',
  email: 'valid_email',
  password: 'valid_password',
  phone: 'valid_phone',
  accessToken: null
})

const makeFakeGuardianWithIdData = (): GuardianWithId => ({
  id: 'valid_id',
  firstName: 'valid_first_name',
  lastName: 'valid_last_name',
  email: 'valid_email',
  password: 'valid_password',
  phone: 'valid_phone',
  accessToken: 'valid_token'
})

export {
  makeFakeGuardianData,
  makeFakeGuardianWithIdData
}
