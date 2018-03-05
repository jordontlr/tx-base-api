const { authenticate } = require('feathers-authentication').hooks
const { restrictToRoles } = require('feathers-authentication-hooks')
const { softDelete, when, setCreatedAt, setUpdatedAt, discard } = require('feathers-hooks-common')

const restrict = [
  authenticate('jwt'),
  restrictToRoles({
    roles: ['admin', 'super-admin', 'manager', 'editor']
  })
]

const addLinkTitle = require('./hook.add-link-title')

module.exports = {
  before: {
    all: [ when(hook => hook.method !== 'find', softDelete()) ],
    find: [],
    get: [],
    create: [ authenticate('jwt'), setCreatedAt(), setUpdatedAt(), addLinkTitle() ],
    update: [ ...restrict, setUpdatedAt() ],
    patch: [ ...restrict, setUpdatedAt() ],
    remove: [ ...restrict ]
  },

  after: {
    all: [
      discard('__v')
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
