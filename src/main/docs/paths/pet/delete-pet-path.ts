export const deletePetPath = {
  delete: {
    tags: ['pet'],
    summary: 'delete an existent pet',
    description: '',
    security: [{
      bearerAuth: []
    }],
    parameters: [{
      name: 'petId',
      in: 'path',
      description: 'pet id',
      required: true,
      schema: {
        type: 'string'
      }
    }],
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string'
                },
                petId: {
                  type: 'string'
                }
              },
              example: {
                message: 'Pet deleted',
                petId: '1cbb4c26-d078-4d45-88cd-08aa167bc1b5'
              }
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
