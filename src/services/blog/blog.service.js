// Initializes the `blog` service on path `/blog`
const createService = require('feathers-mongoose')
const createModel = require('../../models/blog.model')
const hooks = require('./blog.hooks')

module.exports = function () {
  const app = this
  const Model = createModel(app)
  const paginate = app.get('paginate')

  const options = {
    name: 'blog',
    Model,
    paginate
  }

  // Initialize our service with any options it requires
  app.use('/blog', createService(options))

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('blog')

  service.hooks(hooks)
}
