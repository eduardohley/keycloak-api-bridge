const axios = require('axios')
const { createUserSchema, deleteUserSchema, updateUserSchema, resetPasswordSchema } = require('../schemas/user')

module.exports.findByUsername = async (username) => {
  const response = await axios.request({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    url: `http://localhost:${process.env.PORT}/user`,
  })

  const { data: users } = response
  return users.find(user => user.username === username)
}

module.exports.findByID = async (id) => {
  const response = await axios.request({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    url: `http://localhost:${process.env.PORT}/user`,
  })

  const { data: users } = response
  return users.find(user => user.id === id)
}

module.exports.UserRoutes = async (server, options) => {
  // Get Users
  server.route({
    method: 'GET',
    url: '/user',
    handler: async (request, reply) => {
      try {
        const response = await axios.request({
          method: 'GET',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Bearer ' + global.kc_access_token,
          },
          url: process.env.KC_SERVER + `/auth/admin/realms/${process.env.KC_REALM}/users`,
        });

        const { data, status } = response;
        reply.code(status)
        return data
      } catch (error) {
        reply.code(error.response.status)
        return error.response.data
      }
    }
  })

  // Get User
  server.route({
    method: 'GET',
    url: '/user/:id',
    handler: async (request, reply) => {
      const { id } = request.params
      try {
        const response = await axios.request({
          method: 'GET',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: 'Bearer ' + global.kc_access_token,
          },
          url: process.env.KC_SERVER + `/auth/admin/realms/${process.env.KC_REALM}/users/${id}`,
        });

        const { data, status } = response;
        reply.code(status)
        return data
      } catch (error) {
        reply.code(error.response.status)
        return {
          error: 'Not Found',
          error_description: 'User not found'
        }
      }
    }
  })

  // Create User
  server.route({
    method: 'POST',
    url: '/user',
    schema: createUserSchema,
    handler: async (request, reply) => {
      let data = request.body
      if (!data.enabled) data.enabled = true
      if (!data.requiredActions) data.requiredActions = ['UPDATE_PASSWORD']
      if (!data.credentials) data.credentials = [{ type: 'password', value: data.username }]

      try {
        const response = await axios.request({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + global.kc_access_token,
          },
          url: process.env.KC_SERVER + `/auth/admin/realms/${process.env.KC_REALM}/users`,
          data: JSON.stringify(data),
        });

        const user = await this.findByUsername(data.username);
        reply.code(201)
        return user
      } catch (error) {
        reply.code(error.response.status)
        return {
          error: 'Conflict',
          error_description: error.response.data.errorMessage
        }
      }
    }
  })

  // Delete User
  server.route({
    method: 'DELETE',
    url: '/user/:id',
    schema: deleteUserSchema,
    handler: async (request, reply) => {
      const { id } = request.params

      try {
        const response = await axios.request({
          method: 'DELETE',
          headers: {
            Authorization: 'Bearer ' + global.kc_access_token,
          },
          url: process.env.KC_SERVER + `/auth/admin/realms/${process.env.KC_REALM}/users/${id}`,
        });

        reply.code(200)
        return { id }
      } catch (error) {
        reply.code(error.response.status)
        return {
          error: 'Not Found',
          error_description: error.response.data.error
        }
      }
    }
  })

  // Update User
  server.route({
    method: 'PUT',
    url: '/user/:id',
    schema: updateUserSchema,
    handler: async (request, reply) => {
      const { id } = request.params
      const data = request.body
      const user = await this.findByID(id)

      if (!user) {
        reply.code(404)
        return { error: 'Not Found', error_description: 'User not found' }
      }

      try {
        const response = await axios.request({
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + global.kc_access_token,
          },
          url: process.env.KC_SERVER + `/auth/admin/realms/${process.env.KC_REALM}/users/${id}`,
          data: JSON.stringify({
            ...user,
            ...data
          }),
        });

        reply.code(200)
        return { id }
      } catch (error) {
        reply.code(error.response.status)
        return {
          error: 'Not Found',
          error_description: error.response.data.errorMessage
        }
      }
    }
  })

  // Reset User Password
  server.route({
    method: 'GET',
    url: '/user/:id/reset-password',
    schema: resetPasswordSchema,
    handler: async (request, reply) => {
      const { id } = request.params
      const user = await this.findByID(id)

      if (!user) {
        reply.code(404)
        return { error: 'Not Found', error_description: 'User not found' }
      }

      try {
        const response = await axios.request({
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + global.kc_access_token,
          },
          url: process.env.KC_SERVER + `/auth/admin/realms/${process.env.KC_REALM}/users/${id}`,
          data: JSON.stringify({
            ...user,
            requiredActions: ['UPDATE_PASSWORD'],
            credentials: [
              {
                type: 'password',
                value: user.username,
              },
            ],
          }),
        });

        reply.code(200)
        return { id }
      } catch (error) {
        reply.code(error.response.status)
        return {
          error: 'Not Found',
          error_description: error.response.data.error
        }
      }
    }
  })
}