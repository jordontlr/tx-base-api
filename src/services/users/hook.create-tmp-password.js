const { randomBytes } = require('crypto')

const defaults = {
  passwordField: 'tmpPassword',
  plainPasswordField: 'tmpPasswordPlain'
}

// Create temporary password for new signups.
// Though not needed functionally, it returns a promise for consistent testing with other hooks.
module.exports = function (options) {
  options = Object.assign({}, defaults, options)

  return hook => {
    let tmpPassword = randomBytes(5).toString('hex').toUpperCase()
    // create a random string which is the user's plain-text tmpPassword (will be hashed in hooks)
    hook.data[options.passwordField] = tmpPassword

    // Keep plain password for email:
    hook.data[options.plainPasswordField] = tmpPassword

    hook.data.tmpPasswordTimestampExpiry = new Date().getTime() + options.tmpPasswordAddExpiry

    return hook
  }
}
