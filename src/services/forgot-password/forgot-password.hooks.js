const { iff } = require('feathers-hooks-common')
const { hashPassword } = require('feathers-authentication-local').hooks

const findUser = require('./hook.find-user')
const createTmpPassword = require('../users/hook.create-tmp-password')
const normalizeResponse = require('./hook.normalize-response')
const sendForgotPasswordEmailForExistingUser = require('./hook.email.forgot-existing')
const sendForgotPasswordEmailForMissingUser = require('./hook.email.forgot-missing')

module.exports = function ({ app, outboundEmail, emailTemplates, emailBaseVariables }) {
  const tmpPasswordAddExpiry = app.get('tmpPasswordExpiry')

  return {
    before: {
      create: [
        findUser(),
        iff(
          hook => hook.params.user,
          createTmpPassword({
            hashedPasswordField: 'tmpPassword',
            plainPasswordField: 'tmpPasswordPlain',
            tmpPasswordAddExpiry
          }),
          hashPassword({
            passwordField: 'tmpPassword',
            timeStampField: 'tmpPasswordCreatedAt'
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
            tmpPasswordField: 'tmpPasswordPlain',
            emailBaseVariables
          })
        ).else(
          iff(
            hook => hook.app.get('postmark').key !== 'POSTMARK_API_TEST',
            sendForgotPasswordEmailForMissingUser({
              From: outboundEmail,
              TemplateId: emailTemplates.forgotPasswordNonExisting,
              emailBaseVariables
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
