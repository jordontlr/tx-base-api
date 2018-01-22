const mongoose = require('mongoose')

module.exports = function () {
  const app = this

  if (app.get('mongodb') !== 'MONGODB_URI') {
    mongoose.connect(app.get('mongodb'))
  } else {
    mongoose.connect(app.get('mongodb_local'))
  }
  mongoose.Promise = global.Promise

  app.set('mongooseClient', mongoose)
}
