// shop-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient')
  const { Schema } = mongooseClient
  const shop = new Schema({
    product: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    short: { type: String, required: false },
    description: { type: String, required: false },
    delta: { type: String, required: true },
    content: { type: String, required: false },
    sku: { type: String, required: false },
    brand: { type: String, required: false },
    imageId: { type: Array, required: false },
    listed: { type: Boolean, required: true },
    deleted: { type: Boolean },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }, {
    timestamps: true
  })

  return mongooseClient.model('shop', shop)
}
