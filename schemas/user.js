module.exports.createUserSchema = {
  body: {
    type: 'object',
    required: ['username', 'firstName', 'lastName'],
    properties: {
      username: {
        type: 'string'
      },
      enabled: {
        type: 'boolean'
      },
      firstName: {
        type: 'string'
      },
      lastName: {
        type: 'string'
      },
      email: {
        type: 'string'
      },
      credentials: {
        type: 'array'
      },
      requiredActions: {
        type: 'array'
      }
    }
  },
  response: {
    201: {
      type: 'object',
      required: ['id', 'username'],
      properties: {
        id: {
          type: 'string'
        },
        username: {
          type: 'string'
        },
        firstName: {
          type: 'string'
        },
        lastName: {
          type: 'string'
        },
        email: {
          type: 'string'
        },
      }
    },
    409: {
      $ref: 'defaultError'
    }
  }
}

module.exports.deleteUserSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string'
      }
    }
  },
  response: {
    200: {
      type: 'object',
      required: ['id'],
      properties: {
        id: {
          type: 'string'
        }
      }
    },
    404: {
      $ref: 'defaultError'
    }
  }
}

module.exports.updateUserSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string'
      }
    }
  },
  body: {
    type: 'object',
    properties: {
      firstName: {
        type: 'string'
      },
      lastName: {
        type: 'string'
      },
      email: {
        type: 'string'
      },
    }
  },
  response: {
    200: {
      type: 'object',
      required: ['id'],
      properties: {
        id: {
          type: 'string'
        }
      }
    },
    404: {
      $ref: 'defaultError'
    },
    409: {
      $ref: 'defaultError'
    }
  }
}

module.exports.resetPasswordSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'string'
      }
    }
  },
  response: {
    200: {
      type: 'object',
      required: ['id'],
      properties: {
        id: {
          type: 'string'
        }
      }
    },
    404: {
      $ref: 'defaultError'
    }
  }
}