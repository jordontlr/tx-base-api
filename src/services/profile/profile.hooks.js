const { authenticate } = require('@feathersjs/authentication').hooks
const { restrictToOwner, queryWithCurrentUser, associateCurrentUser } = require('feathers-authentication-hooks')
const { softDelete, setCreatedAt, setUpdatedAt, discard } = require('feathers-hooks-common')

module.exports = {
  before: {
    all: [ authenticate('jwt'), softDelete() ],
    find: [ queryWithCurrentUser({idField: '_id', as: 'userId'}) ],
    get: [ restrictToOwner({idField: '_id', ownerField: 'userId'}) ],
    create: [ associateCurrentUser({idField: '_id', as: 'userId'}), setCreatedAt(), setUpdatedAt() ],
    update: [ restrictToOwner({idField: '_id', ownerField: 'userId'}), setUpdatedAt() ],
    patch: [ restrictToOwner({idField: '_id', ownerField: 'userId'}), setUpdatedAt() ],
    remove: [ restrictToOwner({idField: '_id', ownerField: 'userId'}), setUpdatedAt() ]
  },

  after: {
    all: [ discard('__v', 'deleted', 'userId') ],
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
