const { authenticate } = require('@feathersjs/authentication').hooks
const { restrictToRoles, associateCurrentUser } = require('feathers-authentication-hooks')
const { softDelete, setCreatedAt, setUpdatedAt, discard } = require('feathers-hooks-common')

const restrict = [
  authenticate('jwt'),
  restrictToRoles({
    roles: ['admin', 'super-admin', 'manager', 'editor']
  })
]

module.exports = {
  before: {
    all: [ authenticate('jwt'), softDelete() ],
    find: [],
    get: [ setUpdatedAt() ],
    create: [ associateCurrentUser(), setCreatedAt(), setUpdatedAt() ],
    update: [ ...restrict, setUpdatedAt() ],
    patch: [ ...restrict, setUpdatedAt() ],
    remove: [ ...restrict, setUpdatedAt() ]
  },

  after: {
    all: [ discard('__v', 'deleted') ],
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
