'use strict'

// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient')
  const users = new mongooseClient.Schema({
    email: { type: String, unique: true },
    password: { type: String },
    passwordCreatedAt: { type: Date },
    tempPassword: { type: String },
    tempPasswordCreatedAt: { type: Date },
    isNewUser: { type: Boolean, default: true },

    // For changing email:
    emailCode: { type: String },
    newEmail: { type: String },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }, {
    versionKey: false
  })

  return mongooseClient.model('users', users)
}
