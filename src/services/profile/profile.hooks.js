const { authenticate } = require('@feathersjs/authentication').hooks
const { restrictToOwner, queryWithCurrentUser, associateCurrentUser } = require('feathers-authentication-hooks')
const { softDelete, setCreatedAt, setUpdatedAt, discard } = require('feathers-hooks-common')

module.exports = {
  before: {
    all: [ authenticate('jwt'), softDelete() ],
    find: [ queryWithCurrentUser() ],
    get: [ restrictToOwner() ],
    create: [ associateCurrentUser(), setCreatedAt(), setUpdatedAt() ],
    update: [ restrictToOwner(), setUpdatedAt() ],
    patch: [ restrictToOwner(), setUpdatedAt() ],
    remove: [ restrictToOwner(), setUpdatedAt() ]
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
