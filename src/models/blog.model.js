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
    published: { type: Boolean, required: false, default: false },
    datetime: { type: Number, default: Date.now },
    post: { type: String, required: true },
    delta: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: false },
    tags: { type: Array, required: false },
    linkTitle: { type: String, required: false },
    imageId: { type: String, required: false },
    deleted: { type: Boolean },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
  }, {
    timestamps: true
  })

  return mongooseClient.model('blog', blog)
}
