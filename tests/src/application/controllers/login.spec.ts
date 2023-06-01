import { LoginController } from '@/application/controllers/login'
import { badRequest, unauthorized, success } from '@/application/helpers/http'
import { InvalidParamError, MissingParamError } from '@/application/errors'
import { type EmailValidator } from '@/application/validation/protocols'
import { type Authentication } from '@/domain/use-cases'
import {
  makeEmailValidator,
  makeAuthentication,
  makeFakeLoginRequest
} from '@/tests/utils'
import { makeFakeServerError } from '@/tests/utils/mocks/response.mocks'

interface SutTypes {
  sut: LoginController
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const authenticationStub = makeAuthentication()
  const sut = new LoginController(emailValidatorStub, authenticationStub)
  return {
    sut,
    emailValidatorStub,
    authenticationStub
  }
}

describe('Login Controller', () => {
  describe('tests the email field', () => {
    it('Should return 400 if no email is provided', async () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          password: 'any_password'
        }
      }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
    })

    it('Should return 400 if an invalid email is provided', async () => {
      const { sut, emailValidatorStub } = makeSut()
      jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
      const httpResponse = await sut.handle(makeFakeLoginRequest())
      expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
    })

    it('Should call EmailValidator with correct email', async () => {
      const { sut, emailValidatorStub } = makeSut()
      const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
      await sut.handle(makeFakeLoginRequest())
      expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
    })

    it('Should call return 500 if EmailValidator throws', async () => {
      const { sut, emailValidatorStub } = makeSut()
      jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
        throw new Error()
      })
      const httpResponse = await sut.handle(makeFakeLoginRequest())
      expect(httpResponse).toEqual(makeFakeServerError())
    })
  })

  describe('tests the password field', () => {
    it('Should return 400 if no password is provided', async () => {
      const { sut } = makeSut()
      const httpRequest = {
        body: {
          email: 'any_email@mail.com'
        }
      }
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
    })
  })

  describe('test the execution of the Authentication use case', () => {
    it('Should call Authentication with correct values', async () => {
      const { sut, authenticationStub } = makeSut()
      const authSpy = jest.spyOn(authenticationStub, 'auth')
      await sut.handle(makeFakeLoginRequest())
      expect(authSpy).toHaveBeenCalledWith({
        email: 'any_email@mail.com',
        sensitiveData: { field: 'password', value: 'any_password' }
      })
    })

    it('Should return 401 if invalid credentials are provided', async () => {
      const { sut, authenticationStub } = makeSut()
      jest.spyOn(authenticationStub, 'auth').mockResolvedValueOnce(new Error())
      const httpResponse = await sut.handle(makeFakeLoginRequest())
      expect(httpResponse).toEqual(unauthorized(httpResponse.body))
    })

    it('Should return 500 if Authentication throws', async () => {
      const { sut, authenticationStub } = makeSut()
      jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(Promise.reject(new Error()))
      const httpResponse = await sut.handle(makeFakeLoginRequest())
      expect(httpResponse).toEqual(makeFakeServerError())
    })
  })

  describe('test signup controller success case', () => {
    it('Should return 200 if valid credentials are provided', async () => {
      const { sut } = makeSut()
      const httpResponse = await sut.handle(makeFakeLoginRequest())
      expect(httpResponse).toEqual(success({ accessToken: 'any_token' }))
    })
  })
})
