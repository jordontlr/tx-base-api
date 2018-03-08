const { authenticate } = require('@feathersjs/authentication').hooks
// const { restrictToOwner } = require('feathers-authentication-hooks')
const dauria = require('dauria')

const restrict = [
  authenticate('jwt')
  // restrictToOwner({
  //   idField: '_id',
  //   ownerField: '_id'
  // })
]

module.exports = {
  before: {
    all: [], //  ...restrict
    find: [],
    get: [],
    create: [
      function(context) {
        if (!context.data.uri && context.params.file){
          const file = context.params.file;
          const uri = dauria.getBase64DataURI(file.buffer, file.mimetype);
          context.data = {uri: uri};
        }
      }
    ],
    update: [],
    patch: [],
    remove: []
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
