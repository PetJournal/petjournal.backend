import { badRequest, notAcceptable, serverError, success, type HttpRequest, type HttpResponse } from '@/application/helpers'
import { type Validation, type Controller } from '@/application/protocols'
import { type DeletePet } from '@/domain/use-cases'

export class DeletePetController implements Controller {
  private readonly validation: Validation
  private readonly deletePet: DeletePet

  constructor ({ validation, deletePet }: DeletePetController.Dependencies) {
    this.validation = validation
    this.deletePet = deletePet
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.params)
      if (error) {
        return badRequest(error)
      }
      const guardianId = httpRequest.userId as string
      const petId = httpRequest.params.petId as string
      const result = await this.deletePet.delete({ petId, guardianId })
      if (!result.isSuccess) {
        return notAcceptable(result.error as Error)
      }
      return success({
        message: 'Pet deleted',
        petId
      })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace DeletePetController {
  export type Dependencies = {
    validation: Validation
    deletePet: DeletePet
  }
}
