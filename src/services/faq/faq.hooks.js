const { authenticate } = require('feathers-authentication').hooks
const { restrictToRoles } = require('feathers-authentication-hooks')
const { softDelete, when, setCreatedAt, setUpdatedAt, discard } = require('feathers-hooks-common')

const restrict = [
  authenticate('jwt'),
  restrictToRoles({
    roles: ['admin', 'super-admin', 'manager', 'editor']
  })
]

module.exports = {
  before: {
    all: softDelete(),
    find: [],
    get: [],
    create: [ authenticate('jwt'), setCreatedAt(), setUpdatedAt() ],
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
