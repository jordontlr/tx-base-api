const assert = require('assert')
const app = require('../../src/app')

describe('\'faq\' service', () => {
  it('registered the service', () => {
    const service = app.service('faq')

    assert.ok(service, 'Registered the service')
  })
})
