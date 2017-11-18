const assert = require('assert')
const sendEmailCode = require('../../src/services/users/hook.email.new-email-code')

describe('\'sendEmailCode\' hook', () => {
  it('runs the hook', () => {
    // A mock hook object
    const mock = {}
    // Initialize our hook with no options
    const hook = sendEmailCode()

    // Run the hook function (which returns a promise)
    // and compare the resulting hook object
    return hook(mock).then(result => {
      assert.equal(result, mock, 'Returns the expected hook object')
    })
  })
})
