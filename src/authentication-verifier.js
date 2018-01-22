const Verifier = require('feathers-authentication-local').Verifier
const get = require('lodash').get
const Debug = require('debug')
const debug = Debug('feathers-authentication-local-tmp:_comparePassword')
const comparePassword = require('./utils/compare-password')
const currentTimestamp = new Date().getTime()

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

    if (tmpHash && !entity.tmpPasswordTimestampExpiry) {
      return Promise.reject(new Error('Temp password expiry missing!'))
    }

    if (tmpHash && entity.tmpPasswordTimestampExpiry < currentTimestamp) {
      return Promise.reject(new Error('Temp password has expired!'))
    }

    debug('Verifying password')

    return comparePassword(password, hash)
      .catch(() => {
        debug('Password failed. Trying tmpPassword...')
        return comparePassword(password, tmpHash)
          .then(() => {
            entity.tmpPasswordUsed = true
            return entity
          })
      })
      .then(() => {
        return entity
      })
  }
}

module.exports = TmpPswdVerifier
