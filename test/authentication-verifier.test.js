const assert = require('assert')
const feathers = require('feathers')
const { hashPassword } = require('feathers-authentication-local').hooks
// const hashPassword = require('feathers-authentication-local/lib/utils/hash')
// const app = require('../src/app')
const MyVerifier = require('../src/authentication-verifier')

const app = feathers()

describe('MyVerifier', function () {
  const options = {
    service: {},
    tmpPasswordField: 'tempPassword',
    passwordField: 'password'
  }
  const entity = {
    password: '123',
    tempPassword: '456'
  }
  const verifier = new MyVerifier(app, options)

  it('checks the main password field', function () {
    const password = '123'
    const hook = {
      type: 'before',
      app,
      data: entity
    }
    return hashPassword()(hook).then(hook => {
      return verifier._comparePassword(hook.data, password)
    }).then(() => {
      assert.ok('Password was OK')
    })
  })

  it('checks the temporary password field', () => {
    const password = '456'
    const hook = {
      type: 'before',
      app,
      data: entity
    }
    return hashPassword({passwordField: 'tempPassword'})(hook).then(hook => {
      return verifier._comparePassword(hook.data, password)
    }).then(() => {
      assert.ok('Tmp password was OK')
    })
  })
})
