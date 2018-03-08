// profile-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient')
  const { Schema } = mongooseClient
  const profile = new Schema({
    first: { type: String, required: true },
    last: { type: String, required: true },
    image: { type: String, required: true }
  }, {
    timestamps: true
  })

  return mongooseClient.model('profile', profile)
}
