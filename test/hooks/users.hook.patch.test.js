const assert = require('assert')
const userHooks = require('../../src/services/users/users.hooks')
const restrict = userHooks.restrict

const appMock = {
  get () {
    return {}
  }
}
// Remove the restrict hooks from the beginning:
const patchBeforeHooks = userHooks(appMock).before.patch.slice(restrict.length)

// Compose hooks into a promise pipeline:
const patch = hook => {
  return patchBeforeHooks.reduce((hook, hookFn) => {
    return hook.then(hookFn)
  }, Promise.resolve(hook))
}

const passwordPlain = '123'
const passwordHash = '$2a$12$2SGQ2sxmNl8c2U/zhsdno.zJAMNT7OVkZfC3vquZze09IAQl43d8.'
const mockHook = {
  id: 1,
  type: 'before',
  method: 'patch',
  app: appMock,
  params: {
    user: {
      _id: 1,
      password: passwordHash,
      emailCode: '555',
      newEmail: 'new@email.com',
      get () {
        console.log(`user.get`, arguments)
      }
    }
  },
  data: {}
}

describe('\'user.patch\' before hooks', () => {
  describe('For a non special case', function () {
    const hook = Object.assign({}, mockHook, {
      data: {
        password: '123',
        email: 'ilya@email.com',
        foo: 'bar'
      }
    })
    it('should discard password and email', function (done) {
      patch(hook).then(hook => {
        assert.equal(typeof hook.data.password, 'undefined', 'password should be undefined')
        assert.equal(typeof hook.data.email, 'undefined', 'email should be undefined')
        assert.equal(hook.data.foo, 'bar')
        done()
      }).catch(done)
    })
  })
  describe('For a password change case', function () {
    it('should allow password to be set when oldPassword is sent', function (done) {
      const hook = Object.assign({}, mockHook, {
        data: {
          password: '1234',
          oldPassword: passwordPlain
        }
      })
      patch(hook).then(hook => {
        assert.equal(hook.data.password.length, 60, 'password should be hashed')
        done()
      }).catch(done)
    })
    it('should reject incorrect oldPassword', function (done) {
      const hook = Object.assign({}, mockHook, {
        data: {
          password: '1234',
          oldPassword: 'qqq'
        }
      })
      patch(hook).then(hook => {
        assert.ok(false, 'should reject instead')
        done()
      }).catch(err => {
        assert.equal(err.message, 'Incorrect password')
        done()
      }).catch(done)
    })
  })
  describe('For an email change case', function () {
    it('should generate emailCode if the correct password is provided', function (done) {
      const hook = Object.assign({}, mockHook, {
        data: {
          password: '123',
          newEmail: 'ilya@email.com'
        }
      })
      patch(hook).then(hook => {
        assert.ok(hook.data.emailCode, 'emailCode should be generated')
        assert.equal(hook.data.newEmail, 'ilya@email.com', 'newEmail should be set')
        done()
      }).catch(done)
    })
    it('should reject incorrect password with an error message', function (done) {
      const hook = Object.assign({}, mockHook, {
        data: {
          password: '1234',
          newEmail: 'ilya@email.com'
        }
      })
      patch(hook).then(hook => {
        assert.ok(false, 'should reject instead')
        done()
      }).catch(err => {
        assert.equal(err.message, 'Incorrect password')
        done()
      }).catch(done)
    })
    it('should set email to newEmail', function (done) {
      const hook = Object.assign({}, mockHook, {
        data: {
          password: '123',
          emailCode: '555'
        }
      })
      patch(hook).then(hook => {
        assert.equal(hook.data.email, 'new@email.com', 'email should be changes')
        done()
      }).catch(done)
    })
    it('should reject incorrect emailCode', function (done) {
      const hook = Object.assign({}, mockHook, {
        data: {
          password: '123',
          emailCode: '777'
        }
      })
      patch(hook).then(hook => {
        assert.ok(false, 'should reject instead')
        done()
      }).catch(err => {
        assert.equal(err.message, 'Please provide the correct email code')
        done()
      }).catch(done)
    })
  })
})
