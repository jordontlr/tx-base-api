const errors = require('feathers-errors')
const comparePassword = require('../../utils/compare-password')
const Debug = require('debug')
const debug = Debug('hook.check-password')

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function checkPassword (hook) {
    // Two cases:
    // 1. update password: {password, oldPassword}
    // 2. update email:    {password, newEmail, emailCode}

    const password = hook.data.password
    const oldPassword = hook.data.oldPassword
    debug(`password = ${password}, oldPassword = ${oldPassword}`)

    const passwordToCheck = oldPassword || password

    const user = hook.params.user

    if (!user) {
      return Promise.reject(new Error(`No user found with the provided id ${hook.id}`))
    }

    if (!passwordToCheck) {
      return Promise.reject(new errors.BadRequest('Please provide a password'))
    }

    return comparePassword(passwordToCheck, user.password)
      .catch(() => {
        debug(`Password failed. Trying tempPassword...`)
        return comparePassword(passwordToCheck, user.tempPassword)
      })
      .then(() => {
        debug('Password OK')
        if (hook.data.oldPassword) {
          // delete `oldPassword` but keep `password`
          delete hook.data.oldPassword
        } else {
          // in all other cases delete `password` (to not patch the existing one in db)
          delete hook.data.password
        }
        return hook
      })
      .catch(() => {
        return Promise.reject(new errors.BadRequest('Incorrect password'))
      })
  }
}
