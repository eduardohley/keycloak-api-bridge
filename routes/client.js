const axios = require('axios')

module.exports.findClientByName = async (name) => {
  const response = await axios.request({
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + global.kc_access_token,
    },
    url: process.env.KC_SERVER + `/auth/admin/realms/${REALM}/clients`,
  })

  const { data: clients } = response

  return Array.from(clients).find((client: any) => client.clientId === name);
}