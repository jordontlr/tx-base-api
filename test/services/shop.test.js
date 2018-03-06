const assert = require('assert')
const app = require('../../src/app')

describe('\'shop\' service', () => {
  it('registered the service', () => {
    const service = app.service('shop')

    assert.ok(service, 'Registered the service')
  })
})
