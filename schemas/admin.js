module.exports.tokenSchema = {
  response: {
    200: {
      type: 'object',
      required: ['access_token', 'refresh_token', 'expires_in', 'refresh_expires_in'],
      properties: {
        access_token: {
          type: 'string'
        },
        refresh_token: {
          type: 'string'
        },
        expires_in: {
          type: 'number'
        },
        refresh_expires_in: {
          type: 'number'
        }
      }
    },
    401: {
      $ref: 'defaultError'
    },
    400: {
      $ref: 'defaultError'
    }
  }
}
