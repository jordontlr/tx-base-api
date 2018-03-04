const { authenticate } = require('feathers-authentication').hooks
const { restrictToRoles } = require('feathers-authentication-hooks')
const { softDelete, when, setCreatedAt, setUpdatedAt } = require('feathers-hooks-common')

const restrict = [
  authenticate('jwt'),
  restrictToRoles({
    roles: ['admin', 'super-admin', 'manager', 'editor']
  }),
  setUpdatedAt()
]

const addLinkTitle = require('./hook.add-link-title')

module.exports = {
  before: {
    all: [ when(hook => hook.method !== 'find', softDelete()) ],
    find: [],
    get: [], // todo: get based on linkTitle if id doesn't exist
    create: [ authenticate('jwt'), setCreatedAt(), setUpdatedAt(), addLinkTitle() ],
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
}
