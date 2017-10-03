'use strict'

const users = require('./users/users.service.js')
const postmark = require('./postmark-messages')

module.exports = function () {
  const app = this
  app.configure(users)
  app.configure(postmark)
}
