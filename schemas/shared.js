module.exports.defaultError = {
  $id: 'defaultError',
  type: 'object',
  required: ['error', 'error_description'],
  properties: {
    error: {
      type: 'string'
    },
    error_description: {
      type: 'string'
    }
  }
}