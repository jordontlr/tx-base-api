// Initializes the `cart` service on path `/cart`
const createService = require('feathers-mongoose')
const createModel = require('../../models/cart.model')
const hooks = require('./cart.hooks')

module.exports = function (app) {
  const Model = createModel(app)
  const paginate = app.get('paginate')

  const options = {
    name: 'cart',
    Model,
    paginate
  }

  // Initialize our service with any options it requires
  app.use('/cart', createService(options))

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('cart')

  service.hooks(hooks)
}
