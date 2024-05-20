import {
  loginPath,
  signUpPath,
  forgetPasswordPath,
  changePasswordPath,
  waitingCodePath,
  petRegistryPath,
  loadPetsPath,
  loadGuardianNamePath,
  loadCatBreedsPath,
  loadDogBreedsPath,
  loadCatSizesPath,
  loadDogSizesPath
} from './paths/'

export default {
  '/signup': signUpPath,
  '/login': loginPath,
  '/forget-password': forgetPasswordPath,
  '/guardian/change-password': changePasswordPath,
  '/waiting-code': waitingCodePath,
  '/pet': petRegistryPath,
  '/pets': loadPetsPath,
  '/guardian/name': loadGuardianNamePath,
  '/breeds/cat': loadCatBreedsPath,
  '/breeds/dog': loadDogBreedsPath,
  '/sizes/cat': loadCatSizesPath,
  '/sizes/dog': loadDogSizesPath
}
