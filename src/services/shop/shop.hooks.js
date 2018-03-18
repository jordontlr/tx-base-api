const { authenticate } = require('@feathersjs/authentication').hooks
const { restrictToRoles } = require('feathers-authentication-hooks')
const { softDelete, setCreatedAt, setUpdatedAt, discard } = require('feathers-hooks-common')

const restrict = [
  authenticate('jwt'),
  restrictToRoles({
    roles: ['admin', 'super-admin', 'manager', 'editor']
  })
]

module.exports = {
  before: {
    all: [ softDelete() ],
    find: [],
    get: [],
    create: [ ...restrict, setCreatedAt(), setUpdatedAt() ],
    update: [ ...restrict, setUpdatedAt() ],
    patch: [ ...restrict, setUpdatedAt() ],
    remove: [ ...restrict ]
  },

  after: {
    all: [
      discard('__v', 'deleted')
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
