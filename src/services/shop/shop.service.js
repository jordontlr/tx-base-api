// Initializes the `shop` service on path `/shop`
const createService = require('feathers-mongoose')
const createModel = require('../../models/shop.model')
const hooks = require('./shop.hooks')

module.exports = function (app) {
  const Model = createModel(app)
  const paginate = app.get('paginate')

  const options = {
    name: 'shop',
    Model,
    paginate: {
      default: 500,
      max: 500
    }
  }

  // Initialize our service with any options it requires
  app.use('/shop', createService(options))

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('shop')

  service.hooks(hooks)
}
