const { authenticate } = require('feathers-authentication').hooks;
const { restrictToRoles } = require('feathers-authentication-hooks')
const { softDelete, when, setCreatedAt, setUpdatedAt } = require('feathers-hooks-common')

const restrict = [
  authenticate('jwt'),
  restrictToRoles({
    roles: ['admin', 'super-admin', 'manager', 'editor'],
  }),
  setUpdatedAt
]

module.exports = {
  before: {
    all: [ when(hook => hook.method !== 'find', softDelete()) ],
    find: [],
    get: [],
    create: [ authenticate('jwt'), setCreatedAt, setUpdatedAt ],
    update: [ ...restrict ],
    patch: [ ...restrict ],
    remove: [ ...restrict ]
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
