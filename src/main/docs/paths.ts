import {
  loginPath,
  signUpPath,
  forgetPasswordPath,
  changePasswordPath,
  waitingCodePath,
  loadPetsPath,
  loadGuardianNamePath,
  loadCatBreedsPath,
  loadDogBreedsPath,
  loadCatSizesPath,
  loadDogSizesPath,
  petRegistryPath,
  updatePetPath
} from './paths/'

export default {
  '/signup': signUpPath,
  '/login': loginPath,
  '/forget-password': forgetPasswordPath,
  '/guardian/change-password': changePasswordPath,
  '/waiting-code': waitingCodePath,
  '/pet': { ...petRegistryPath, ...loadPetsPath },
  '/pet/{petId}': updatePetPath,
  '/guardian/name': loadGuardianNamePath,
  '/breeds/cat': loadCatBreedsPath,
  '/breeds/dog': loadDogBreedsPath,
  '/sizes/cat': loadCatSizesPath,
  '/sizes/dog': loadDogSizesPath
}
