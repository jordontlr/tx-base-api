const { iff } = require('feathers-hooks-common')
const { hashPassword } = require('feathers-authentication-local').hooks

const findUser = require('./hook.find-user')
const createTempPassword = require('../users/hook.create-temp-password')
const normalizeResponse = require('./hook.normalize-response')
const sendForgotPasswordEmailForExistingUser = require('./hook.email.forgot-existing')
const sendForgotPasswordEmailForMissingUser = require('./hook.email.forgot-missing')

module.exports = function ({ outboundEmail, emailTemplates }) {
  return {
    before: {
      create: [
        findUser(),
        iff(
          hook => hook.params.user,
          createTempPassword({
            hashedPasswordField: 'tempPassword',
            plainPasswordField: 'tempPasswordPlain'
          }),
          hashPassword({
            passwordField: 'tempPassword',
            timeStampField: 'tempPasswordCreatedAt'
          })
        ).else(
          normalizeResponse()
        )
      ]
    },

    after: {
      create: [
        iff(
          hook => hook.params.user && hook.app.get('postmark').key !== 'POSTMARK_API_TEST',
          sendForgotPasswordEmailForExistingUser({
            From: outboundEmail,
            TemplateId: emailTemplates.forgotPasswordExisting,
            tempPasswordField: 'tempPasswordPlain'
          })
        ).else(
          iff(
            hook => hook.app.get('postmark').key !== 'POSTMARK_API_TEST',
            sendForgotPasswordEmailForMissingUser({
              From: outboundEmail,
              TemplateId: emailTemplates.forgotPasswordNonExisting
            })
          )
        ),
        normalizeResponse()],
      update: [],
      patch: [],
      remove: []
    }
  }

}