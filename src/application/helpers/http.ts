import { ServerError } from '@/application/errors'

export interface HttpRequest {
  body?: any
}

export interface HttpResponse {
  statusCode: number
  body: any
}

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const conflict = (data: any): HttpResponse => ({
  statusCode: 409,
  body: data
})

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack as string)
})

export const success = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})

export const create = (data: any): HttpResponse => ({
  statusCode: 201,
  body: data
})
