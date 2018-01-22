// Initializes the `forgot-password` service on path `/forgot-password`
const createService = require('./forgot-password.class.js')
const hooks = require('./forgot-password.hooks')
const filters = require('./forgot-password.filters')

module.exports = function () {
  const app = this
  const paginate = app.get('paginate')
  const outboundEmail = app.get('outboundEmail')
  const emailTemplates = app.get('postmarkTemplateIds')
  const emailBaseVariables = app.get('postMarkVariables')

  const options = {
    name: 'forgot-password',
    paginate,
    app
  }

  // Initialize our service with any options it requires
  app.use('/forgot-password', createService(options))

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('forgot-password')

  service.hooks(hooks({ app, outboundEmail, emailTemplates, emailBaseVariables }))

  if (service.filter) {
    service.filter(filters)
  }
}
