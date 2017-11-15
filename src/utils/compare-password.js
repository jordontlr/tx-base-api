const bcrypt = require('bcryptjs')
const Debug = require('debug')

const debug = Debug('utils:comparePassword')

const comparePassword = (password, hash) => {
  return new Promise((resolve, reject) => {
    if (!hash) {
      debug('No hash')
      reject(new Error('Empty hash'))
    }
    debug(`Trying compare password with hash=${hash}`)
    bcrypt.compare(password, hash, function (error, result) {
      // Handle 500 server error.
      if (error) {
        return reject(error)
      }

      if (!result) {
        debug('Password incorrect')
        return reject(new Error('Password incorrect'))
      }

      debug('Password correct')
      return resolve(true)
    })
  })
}

module.exports = comparePassword
