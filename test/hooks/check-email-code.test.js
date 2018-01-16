const assert = require('assert')
const checkEmailCode = require('../../src/services/users/hook.check-email-code')

describe('\'checkEmailCode\' hook', () => {
  it('should change email to new email', () => {
    // A mock hook object
    const mock = {
      data: {
        emailCode: '123',
        newEmail: 'another@email.com'
      },
      params: {
        user: {
          password: 'password hash',
          email: 'email@email.com',
          newEmail: 'another@email.com',
          emailCode: '123'
        }
      }
    }
    const hook = checkEmailCode()

    return hook(mock).then(result => {
      assert.equal(result.data.email, mock.params.user.newEmail, 'Should update email with newEmail')
      assert.equal(result.data.emailCode, '', 'Should empty emailCode')
      assert.equal(result.data.newEmail, '', 'Should empty newEmail')
    })
  })

  it('should fail if emailCode is incorrect', () => {
    // A mock hook object
    const mock = {
      data: {
        emailCode: '1234',
        newEmail: 'another@email.com'
      },
      params: {
        user: {
          password: 'password hash',
          email: 'email@email.com',
          newEmail: 'another@email.com',
          emailCode: '123'
        }
      }
    }
    const hook = checkEmailCode()

    return hook(mock).then(result => {
      assert.ok(false)
    }).catch(error => {
      assert.equal(error.message, 'Please provide the correct email code')
    })
  })

  it('should fail when no user', () => {
    // A mock hook object
    const mock = {
      id: 1,
      params: {}
    }
    const hook = checkEmailCode()

    return hook(mock).then(result => {
      assert.ok(false)
    }).catch(error => {
      assert.equal(error.message, 'No user found with the provided id 1')
    })
  })
})
