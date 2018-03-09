// profile-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient')
  const { Schema } = mongooseClient
  const profile = new Schema({
    firstName: { type: String, required: false },
    lastName: { type: String, required: false },
    image: { type: String, required: false },
    gender: { type: String, required: false },
    countryCode: { type: String, required: false },
    dayOfBirth: { type: Number, required: false },
    monthOfBirth: { type: Number, required: false },
    yearOfBirth: { type: Number, required: false },
    userId: { type: String, required: true },
    deleted: { type: Boolean },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }, {
    timestamps: true
  })

  return mongooseClient.model('profile', profile)
}
