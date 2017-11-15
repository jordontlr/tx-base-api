const { authenticate } = require('feathers-authentication').hooks
const { restrictToOwner } = require('feathers-authentication-hooks')
const { hashPassword } = require('feathers-authentication-local').hooks
const { iff, when, discard } = require('feathers-hooks-common') // disallow, isProvider, lowerCase
const restrict = [
  authenticate('jwt'),
  restrictToOwner({
    idField: '_id',
    ownerField: '_id'
  })
]

const isExistingUser = require('./hook.is-existing-user')
const createTemporaryPassword = require('./hook.create-temp-password')
const sendWelcomeEmail = require('./hook.email.welcome')
const sendDuplicateSignupEmail = require('./hook.email.duplicate-signup')
const getUser = require('./hook.get-user')
const checkPassword = require('./hook.check-password')

module.exports = function (app) {
  const outboundEmail = app.get('outboundEmail')
  const emailTemplates = app.get('postmarkTemplateIds')

  return {
    before: {
      all: [],
      find: [authenticate('jwt')],
      get: [...restrict],
      create: [
        isExistingUser(),
        iff(
          hook => !hook.params.existingUser,
          // If the user has passed a password for account creation, delete it.
          discard('password'),
          createTemporaryPassword({hashedPasswordField: 'tempPassword', plainPasswordField: 'tempPasswordPlain'}),
          hashPassword({passwordField: 'tempPassword', timeStampField: 'tempPasswordCreatedAt'})
        )
      ],
      update: [...restrict, hashPassword()],
      patch: [
        ...restrict,
        iff (
          hook => hook.data && hook.data.password,
          getUser(),
          checkPassword(),
          hashPassword()
        )
      ],
      remove: [...restrict]
    },

    after: {
      all: [
        when(
          hook => hook.params.provider,
          discard('password'),
          discard('tempPassword')
        )
      ],
      find: [],
      get: [],
      create: [
        iff(
          hook => hook.params.existingUser,
          sendDuplicateSignupEmail({
            From: outboundEmail,
            TemplateId: emailTemplates.duplicateSignup
          })
        ).else(
          sendWelcomeEmail({
            From: outboundEmail,
            TemplateId: emailTemplates.welcome,
            tempPasswordField: 'tempPasswordPlain'
          })
        )
      ],
      update: [],
      patch: [],
      remove: []
    },

    error: {
      all: [],
      find: [],
      get: [],
      create: [],
      update: [],
      patch: [],
      remove: []
    }
  }
}
