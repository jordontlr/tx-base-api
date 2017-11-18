const errors = require('feathers-errors')

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function checkEmailCode (hook) {
    const emailCode = hook.data.emailCode

    const user = hook.params.user

    if (!user) {
      return Promise.reject(new Error(`No user found with the provided id ${hook.id}`))
    }

    if (!emailCode || emailCode !== user.emailCode) {
      return Promise.reject(new errors.BadRequest('Please provide the correct email code.'))
    }

    return Promise.resolve(hook)
  }
}
