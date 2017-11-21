// Initializes the `faq` service on path `/faq`
const createService = require('feathers-mongoose')
const createModel = require('../../models/faq.model')
const hooks = require('./faq.hooks')
const filters = require('./faq.filters')

module.exports = function () {
  const app = this
  const Model = createModel(app)
  const paginate = app.get('paginate')

  const options = {
    name: 'faq',
    Model,
    paginate
  }

  // Initialize our service with any options it requires
  app.use('/faq', createService(options))

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('faq')

  service.hooks(hooks)

  if (service.filter) {
    service.filter(filters)
  }
}
