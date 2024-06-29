export const updatePetPath = {
  put: {
    tags: ['pet'],
    summary: 'update an existent pet',
    description: 'if you don\'t want change some field, just put null on it, then your field will use the save data',
    security: [{
      bearerAuth: []
    }],
    consumes: [
      'application/json'
    ],
    produces: [
      'application/json',
      'application/xml'
    ],
    parameters: [{
      name: 'petId',
      in: 'path',
      description: 'pet id',
      required: true,
      schema: {
        type: 'string'
      }
    }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/updatePetParams'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/pet'
            }
          }
        }
      },
      400: {
        $ref: '#/components/badRequest'
      },
      406: {
        $ref: '#/components/notAcceptable'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}