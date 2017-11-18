const { randomBytes } = require('crypto')

const defaults = {
  emailCode: 'someEmailCode'
}

// Create temporary email code to change email
// Though not needed functionally, it returns a promise for consistent testing with other hooks.
module.exports = function (options) {
  options = Object.assign({}, defaults, options)

  return hook => {
    // create a random string which is the user's new email address confirmation code
    hook.data[options.emailCode] = randomBytes(5).toString('hex').toUpperCase()

    return hook
  }
}
