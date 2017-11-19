const assert = require('assert')
const { randomBytes } = require('crypto')
const createEmailCode = require('../../src/services/users/hook.create-email-code')

describe('\'createEmailCode\' hook', () => {
  it('should create a random code', () => {
    // A mock hook object
    const mock = {
      data: {}
    }
    const hook = createEmailCode()

    let result = hook(mock)
    assert.equal(result.data.emailCode.length, 10, 'Should be the same length')
    assert.equal(result.data.emailCode.toUpperCase(), result.data.emailCode, 'Should be uppercase')
  })
})
