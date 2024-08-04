export const emailConfirmationPath = {
  patch: {
    tags: ['guardian'],
    summary: 'confirm email of guardian',
    description: '',
    produces: [
      'application/json'
    ],
    parameters: [{
      name: 'userId',
      in: 'path',
      description: 'user id',
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
                userId: {
                  type: 'string'
                },
                email: {
                  type: 'string'
                }
              },
              example: {
                message: 'Email confirmed',
                userId: '74083fc1-8892-458a-9b9b-78f5e803c7b2',
                email: 'email@email.com'
              }
            }
          }
        }
      },
      400: {
        $ref: '#/components/badRequest',
        example: {
          error: 'Not Found: guardian'
        }
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}
