const { authenticate } = require('feathers-authentication').hooks;
const { restrictToOwner } = require('feathers-authentication-hooks')
const { softDelete, when, setCreatedAt, setUpdatedAt } = require('feathers-hooks-common')

const restrict = [
  authenticate('jwt'),
  restrictToOwner({
    idField: '_id',
    ownerField: '_id'
  })
]

module.exports = {
  before: {
    all: [when(hook => hook.method !== 'find', softDelete())],
    find: [],
    get: [],
    create: [ authenticate('jwt'), setCreatedAt ],
    update: [ ...restrict, setUpdatedAt ],
    patch: [ ...restrict, setUpdatedAt ],
    remove: [ ...restrict, setUpdatedAt ]
  },

  after: {
    all: [],
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
};
