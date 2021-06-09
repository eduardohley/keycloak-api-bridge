module.exports.setUserRoleSchema = {
  params: {
    type: 'object',
    required: ['userId'],
    properties: {
      userId: {
        type: 'string'
      }
    }
  },
  body: {
    type: 'object',
    required: ['role_name'],
    properties: {
      role_name: {
        type: 'string'
      }
    }
  },
  response: {
    200: {
      type: 'object',
      required: ['id', 'name', 'containerId'],
      properties: {
        id: {
          type: 'string'
        },
        name: {
          type: 'string'
        },
        containerId: {
          type: 'string'
        }
      }
    },
    404: {
      $ref: 'defaultError'
    }
  }
}

module.exports.getRoleSchema = {
  querystring: {
    type: 'object',
    required: ['name'],
    properties: {
      name: {
        type: 'string'
      }
    }
  },
  response: {
    404: {
      $ref: 'defaultError'
    }
  }
}