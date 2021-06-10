module.exports.translateError = (errorData) => {
  let { error, error_description } = errorData
  let translated = ''

  switch (error_description) {
    case 'User exists with same username':
      translated = 'El nombre de usuario ya está registrado'
      break
    case 'User name is missing':
      translated = 'Nombre de usuario vacío'
      break
    case 'User not found':
      translated = 'Usuario no encontrado'
      break
    case 'Role not found':
      translated = 'Rol no encontrado'
      break
    default:
      translated = 'e: ' + error_description
      break
  }

  return {
    error,
    error_description: translated
  }
}