const assert = require('assert')
const app = require('../../src/app')

describe('\'cart\' service', () => {
  it('registered the service', () => {
    const service = app.service('cart')

    assert.ok(service, 'Registered the service')
  })
})
