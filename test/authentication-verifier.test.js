const assert = require('assert')
const feathers = require('feathers')
const { hashPassword } = require('feathers-authentication-local').hooks
// const hashPassword = require('feathers-authentication-local/lib/utils/hash')
// const app = require('../src/app')
const MyVerifier = require('../src/authentication-verifier')
const pastTimestamp = new Date().getTime() - 100000
const futureTimestamp = new Date().getTime() + 100000

const app = feathers()

describe('MyVerifier', function () {
  const options = {
    service: {},
    passwordField: 'password'
  }
  const entity = {
    password: '123',
    tmpPassword: '456',
    tempPasswordTimestampExpiry: futureTimestamp
  }
  const verifier = new MyVerifier(app, options)

  it('checks the expiry field is there', function () {
    const password = '123'
    const hook = {
      type: 'before',
      app,
      data: {
        password: '123',
        tmpPassword: '456'
      }
    }
    return hashPassword()(hook).then(hook => {
      return verifier._comparePassword(hook.data, password)
    }).then(() => {
      assert.ok(false, 'should throw an error instead')
    })
    // Note: must check the exact error message.
      .catch(err => {
        assert.equal(err.message, 'Temp password expiry missing!')
      })
  })

  it('checks if the temp password has expired', function () {
    const password = '123'
    const hook = {
      type: 'before',
      app,
      data: {
        password: '123',
        tmpPassword: '456',
        tempPasswordTimestampExpiry: pastTimestamp
      }
    }
    return hashPassword()(hook).then(hook => {
      return verifier._comparePassword(hook.data, password)
    }).then(() => {
      assert.ok(false, 'should throw an error instead')
    })
    // Note: must check the exact error message.
      .catch(err => {
        assert.equal(err.message, 'Temp password has expired!')
      })
  })

  it('checks the main password field', function () {
    const password = '123'
    const hook = {
      type: 'before',
      app,
      data: entity
    }
    return hashPassword()(hook).then(hook => {
      return verifier._comparePassword(hook.data, password)
    }).then(() => {
      assert.ok('Password was OK')
    })
  })

  it('checks the temporary password field', () => {
    const password = '456'
    const hook = {
      type: 'before',
      app,
      data: entity
    }
    return hashPassword({passwordField: 'tmpPassword'})(hook).then(hook => {
      return verifier._comparePassword(hook.data, password)
    }).then(() => {
      assert.ok('Tmp password was OK')
    })
  })

  it('checks the temporary password field if there is no main password', () => {
    const password = '456'
    const hook = {
      type: 'before',
      app,
      data: {
        tmpPassword: '456',
        tempPasswordTimestampExpiry: futureTimestamp
      }
    }
    return hashPassword({passwordField: 'tmpPassword'})(hook).then(hook => {
      return verifier._comparePassword(hook.data, password)
    }).then(() => {
      assert.ok('Tmp password was OK')
    })
  })

  it('should reject if there is no passwords in db', () => {
    const password = '456'
    return verifier._comparePassword({}, password)
      // Note: must check the success (which is actually a failure).
      .then(() => {
        assert.ok(false, 'should throw an error instead')
      })
      // Note: must check the exact error message.
      .catch(err => {
        // todo: figure out how not to capture the assertion from `then()` here (instead of the below check).
        assert.notEqual(err.message, 'should throw an error instead', err.message)
        assert.notEqual(err.message.search('record in the database is missing both'), -1, 'should reject with the correct message')
      })
  })
})
