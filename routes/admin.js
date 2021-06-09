const axios = require('axios')
const { tokenSchema } = require('../schemas/admin')

started = false

module.exports.getAdminAccessToken = async () => {
  try {
    const response = await axios.request({
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      url: `http://localhost:${process.env.PORT}/token`,
    })
    const { data: { access_token } } = response
    global.kc_access_token = access_token

    if (started) return
    console.log(process.env.KC_SERVER);
    if (access_token) console.log("Logged in")
    started = true
  } catch (error) {
    console.log(error.response.data)
    process.exit(1)
  }
}

module.exports.AdminRoutes = async (server, options) => {
  server.route({
    method: 'GET',
    url: '/token',
    schema: tokenSchema,
    handler: async (request, reply) => {
      const params = new URLSearchParams()
      params.append('client_id', process.env.KC_ADMIN_CLI_ID)
      params.append('username', process.env.KC_USERNAME)
      params.append('password', process.env.KC_PASSWORD)
      params.append('grant_type', 'password')

      try {
        const response = await axios.request({
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          url: process.env.KC_SERVER + '/auth/realms/master/protocol/openid-connect/token',
          data: params,
        })

        const { data: { access_token, refresh_token, expires_in, refresh_expires_in } } = response;
        return { access_token, refresh_token, expires_in, refresh_expires_in }
      } catch (error) {
        reply.code(error.response.status)
        return error.response.data
      }
    }
  })
}