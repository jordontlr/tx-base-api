const errors = require('feathers-errors')

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function checkEmailCode (hook) {
    const user = hook.params.user
    if (!user) {
      return Promise.reject(new Error(`No user found with the provided id ${hook.id}`))
    }

    const emailCode = hook.data.emailCode
    if (!emailCode || emailCode !== user.emailCode) {
      return Promise.reject(new errors.BadRequest('Please provide the correct email code'))
    }

    hook.data.email = user.newEmail
    hook.data.newEmail = ''
    hook.data.emailCode = ''

    return Promise.resolve(hook)
  }
}
