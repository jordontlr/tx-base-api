'use strict'

const users = require('./users/users.service.js')
const postmark = require('./postmark-messages')
const forgotPassword = require('./forgot-password/forgot-password.service.js')
const faq = require('./faq/faq.service.js')
const blog = require('./blog/blog.service.js')
const shop = require('./shop/shop.service.js')
const uploads = require('./uploads/uploads.service.js')

const profile = require('./profile/profile.service.js')

const image = require('./image/image.service.js')

module.exports = function (app) {
  app.configure(users)
  app.configure(postmark)
  app.configure(forgotPassword)
  app.configure(faq)
  app.configure(blog)
  app.configure(shop)
  app.configure(uploads)
  app.configure(profile)
  app.configure(image)
}
