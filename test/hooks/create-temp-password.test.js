const assert = require('assert')
const createTempPasswordCode = require('../../src/services/users/hook.create-temp-password')

describe('\'createTempPassword\' hook', () => {
  it('should create a random temp password and expiry', () => {
    // A mock hook object
    const mock = {
      data: {}
    }
    const hook = createTempPasswordCode()

    let result = hook(mock)
    assert.equal(result.data.tempPassword.length, 10, 'Should be the same length')
    assert.equal(result.data.tempPassword.toUpperCase(), result.data.tempPassword, 'Should be uppercase')
    assert.equal(result.data.tempPassword, result.data.tempPasswordPlain, 'Should be the same')
    assert.ok(result.data.tempPasswordTimestampExpiry !== '', 'Should not be empty')
  })
})
