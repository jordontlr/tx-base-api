// Application hooks that run for every service
const logger = require('./hooks/logger')
const addUserAgent = require('./hooks/user-agent')

module.exports = {
  before: {
    all: [ addUserAgent() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [ logger() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [ logger() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
}
