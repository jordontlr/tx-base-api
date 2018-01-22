const mongoose = require('mongoose')

module.exports = function () {
  const app = this

  if (app.get('mongodb_staging') === 'MONGODB_URI') {
    mongoose.connect(app.get('mongodb_staging'))
  } else {
    mongoose.connect(app.get('mongodb_local'))
  }
  mongoose.Promise = global.Promise

  app.set('mongooseClient', mongoose)
}
