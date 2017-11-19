'use strict'

const users = require('./users/users.service.js')
const postmark = require('./postmark-messages')

const forgotPassword = require('./forgot-password/forgot-password.service.js')

const faq = require('./faq/faq.service.js');

module.exports = function () {
  const app = this
  app.configure(users)
  app.configure(postmark)
  app.configure(forgotPassword)
  app.configure(faq);
}
