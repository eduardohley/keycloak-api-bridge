const axios = require('axios')
const { setUserRoleSchema, getRoleSchema } = require('../schemas/role')
const { translateError } = require('../util/errors')
const { findByID } = require('./user')

module.exports.RoleRoutes = async (server, options) => {
  server.route({
    method: 'GET',
    url: '/role',
    schema: getRoleSchema,
    handler: async (request, reply) => {
      const { name } = request.query
      try {
        const response = await axios.get(process.env.KC_SERVER + `/auth/admin/realms/${process.env.KC_REALM}/roles/${name}`, {
          headers: {
            Authorization: 'Bearer ' + global.kc_access_token,
          },
        })

        const { data: role } = response
        return role;
      } catch (error) {
        reply.code(error.response.status)
        return translateError({
          error: 'Not Found',
          error_description: 'Role not found'
        })
      }
    }
  })

  // Set User Role
  server.route({
    method: 'POST',
    url: '/role/:userId',
    schema: setUserRoleSchema,
    handler: async (request, reply) => {
      const { userId } = request.params
      const { role_name } = request.body

      try {
        const roleResponse = await axios.get(`http://localhost:${process.env.PORT}/role?name=${role_name}`)
        const { data: role } = roleResponse

        const userResponse = await axios.get(`http://localhost:${process.env.PORT}/user/${userId}`)
        const { data: user } = userResponse

        const setResponse = await axios.request({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + global.kc_access_token,
          },
          url: process.env.KC_SERVER + `/auth/admin/realms/${process.env.KC_REALM}/users/${user.id}/role-mappings/realm`,
          data: JSON.stringify([role]),
        });

        const { data } = roleResponse;
        return data
      } catch (error) {
        reply.code(error.response.status)
        return translateError(error.response.data)
      }
    }
  })
}