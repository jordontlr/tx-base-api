const assert = require('assert')
const createTmpPasswordCode = require('../../src/services/users/hook.create-tmp-password')

describe('\'createTmpPassword\' hook', () => {
  it('should create a random temp password and expiry', () => {
    // A mock hook object
    const mock = {
      data: {}
    }
    const hook = createTmpPasswordCode()

    let result = hook(mock)
    assert.equal(result.data.tmpPassword.length, 10, 'Should be the same length')
    assert.equal(result.data.tmpPassword.toUpperCase(), result.data.tmpPassword, 'Should be uppercase')
    assert.equal(result.data.tmpPassword, result.data.tmpPasswordPlain, 'Should be the same')
    assert.ok(result.data.tmpPasswordTimestampExpiry !== '', 'Should not be empty')
  })
})
