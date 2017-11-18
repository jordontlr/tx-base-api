const { randomBytes } = require('crypto')

const defaults = {
  passwordField: 'tempPassword',
  plainPasswordField: 'tempPasswordPlain'
}

// Create temporary password for new signups.
// Though not needed functionally, it returns a promise for consistent testing with other hooks.
module.exports = function (options) {
  options = Object.assign({}, defaults, options)

  return hook => {
    let tempPassword = randomBytes(5).toString('hex').toUpperCase()
    // create a random string which is the user's plain-text tempPassword (will be hashed in hooks)
    hook.data[options.passwordField] = tempPassword

    // Keep plain password for email:
    hook.data[options.plainPasswordField] = tempPassword

    return hook
  }
}
