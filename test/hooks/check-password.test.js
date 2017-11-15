const assert = require('assert')
const checkPassword = require('../../src/services/users/hook.check-password')

const passwordPlain = '123'
const passwordHash = '$2a$12$2SGQ2sxmNl8c2U/zhsdno.zJAMNT7OVkZfC3vquZze09IAQl43d8.'

describe('\'checkPassword\' hook', () => {
  it('should reject with provide-a-password message', () => {
    // A mock hook object
    const mock = {
      data: {},
      params: {
        user: { password: 'password hash' }
      }
    }
    // Initialize our hook with no options
    const hook = checkPassword()

    return hook(mock).then(() => {
      assert.ok(false, 'should reject instead')
    }).catch(err => {
      assert.equal(err.message, 'Please provide a password')
    })
  })

  it('should reject with incorrect-password message', () => {
    const mock = {
      data: { password: '111' },
      params: {
        user: { password: passwordHash }
      }
    }
    const hook = checkPassword()

    return hook(mock).then(() => {
      assert.ok(false, 'should reject instead')
    }).catch(err => {
      assert.equal(err.message, 'Incorrect password')
    })
  })

  it('should reject with incorrect-password message when incorrect oldPassword is provided', () => {
    const mock = {
      data: {
        password: '111',
        oldPassword: '111'
      },
      params: {
        user: {
          password: passwordHash
        }
      }
    }
    const hook = checkPassword()

    return hook(mock).then(() => {
      assert.ok(false, 'should reject instead')
    }).catch(err => {
      assert.equal(err.message, 'Incorrect password')
    })
  })

  it('should reject with no-user-found message', () => {
    const mock = {
      data: { password: '111' },
      params: {},
      id: 1
    }
    const hook = checkPassword()

    return hook(mock).then(() => {
      assert.ok(false, 'should reject instead')
    }).catch(err => {
      assert.equal(err.message, 'No user found with the provided id 1')
    })
  })

  it('should resolve when correct password is provided', () => {
    const mock = {
      data: { password: '111', oldPassword: passwordPlain },
      params: {
        user: { password: passwordHash }
      }
    }
    const hook = checkPassword()

    return hook(mock).then(result => {
      assert.equal(result.data.password, mock.data.password)
      assert.ok(!result.data.oldPassword)
    })
  })

  it('should resolve when correct password is provided', () => {
    const mock = {
      data: { password: passwordPlain, email: 'user@mail.com' },
      params: {
        user: { password: passwordHash }
      }
    }
    const hook = checkPassword()

    return hook(mock).then(result => {
      assert.equal(result.data.email, mock.data.email)
      assert.ok(!result.data.password)
    })
  })
})
