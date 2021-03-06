// cart-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient')
  const { Schema } = mongooseClient
  const cart = new Schema({
    fingerprint: { type: String, required: false },
    userId: { type: String, required: false },
    cartItems: { type: Array, required: false },

    paymentInitiated: { type: Boolean, default: false },
    paymentAuthorized: { type: Boolean, default: false },
    paymentComplete: { type: Boolean, default: false },

    paymentType: { type: String, required: false },
    payPal: { type: Object, required: false },
    stripe: { type: Object, required: false },

    public: { type: Boolean, default: true },
    deleted: { type: Boolean },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }, {
    timestamps: true
  })

  return mongooseClient.model('cart', cart)
}
