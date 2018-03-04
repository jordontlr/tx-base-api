// blog-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient')
  const { Schema } = mongooseClient
  const blog = new Schema({
    title: { type: String, required: true },
    shortPost: { type: String, required: true },
    published: { type: Boolean, required: true },
    datetime: { type: Number, required: true },
    post: { type: String, required: true },
    delta: { type: String, required: true },
    author: { type: String, required: true },
    linkTitle: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }, {
    timestamps: true
  })

  return mongooseClient.model('blog', blog)
}
