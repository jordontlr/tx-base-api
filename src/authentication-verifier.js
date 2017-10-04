const Verifier = require('feathers-authentication-local').Verifier
const get = require('lodash').get
const bcrypt = require('bcryptjs')
const Debug = require('debug')

const debug = Debug('feathers-authentication-local-tmp:_comparePassword');

class TmpPswdVerifier extends Verifier {
  _comparePassword (entity, password) {
    // select entity password field - take entityPasswordField over passwordField
    const passwordField = this.options.entityPasswordField || this.options.passwordField
    const tmpPasswordField = this.options.tmpPasswordField || 'tmpPassword'

    // find password in entity, this allows for dot notation
    const hash = get(entity, passwordField)
    const tmpHash = get(entity, tmpPasswordField)

    if (!hash && !tmpHash) {
      return Promise.reject(
        new Error(`'${this.options.entity}' record in the database is missing both '${passwordField}' and '${tmpPasswordField}'`)
      )
    }

    debug('Verifying password');

    return comparePswd(password, hash)
      .catch(() => {
        debug('Password failed. Trying tmpPassword...')
        return comparePswd(password, tmpHash)
      })
      .then(() => {
        entity.tmpPasswordUsed = true
        return entity
      })
  }
}
const comparePswd = (password, hash) => {
  return new Promise((resolve, reject) => {
    if (!hash) {
      debug('No hash')
      reject('Empty hash')
    }
    debug(`Trying compare password with hash=${hash}`)
    bcrypt.compare(password, hash, function (error, result) {
      // Handle 500 server error.
      if (error) {
        return reject(error)
      }

      if (!result) {
        debug('Password incorrect')
        return reject(false)
      }

      debug('Password correct')
      return resolve(true)
    })
  })
}

module.exports = TmpPswdVerifier
