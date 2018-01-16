const { authenticate } = require('feathers-authentication').hooks
const { restrictToOwner } = require('feathers-authentication-hooks')
const { hashPassword } = require('feathers-authentication-local').hooks
const { iff, discard, isProvider } = require('feathers-hooks-common') // disallow, isProvider, lowerCase
const restrict = [
  authenticate('jwt'),
  restrictToOwner({
    idField: '_id',
    ownerField: '_id'
  })
]
// const log = (msg, obj) => hook => ((obj ? console.log(msg, obj) : console.log(msg)), hook)

const isExistingUser = require('./hook.is-existing-user')
const createTemporaryPassword = require('./hook.create-temp-password')
const sendWelcomeEmail = require('./hook.email.welcome')
const sendDuplicateSignupEmail = require('./hook.email.duplicate-signup')
const getUser = require('./hook.get-user')
const checkPassword = require('./hook.check-password')
const sendEmailCode = require('./hook.email.new-email-code')
const checkEmailCode = require('./hook.check-email-code')
const createEmailCode = require('./hook.create-email-code')

module.exports = function (app) {
  const outboundEmail = app.get('outboundEmail')
  const emailTemplates = app.get('postmarkTemplateIds')
  const emailBaseVariables = app.get('postMarkVariables')

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
      update: [
        context => {
          return context.service.patch(context.id, context.data, context.params)
            .then(result => {
              context.result = result
              return context
            })
        }
      ],
      patch: [
        ...restrict,
        // Do not allow changing user's password and email outside of the special cases down below.
        iff(
          hook => (hook.data && hook.data.password && !(hook.data.oldPassword || hook.data.newEmail || hook.data.emailCode)),
          discard('password', 'email')
        ),
        // Case: change password.
        iff(
          hook => hook.data && hook.data.password && hook.data.oldPassword,
          getUser(),
          checkPassword(),
          hashPassword(),
          // If password gets changed remove the tempPassword:
          hook => {
            hook.data.tempPassword = ''
            return hook
          }
        ),
        // Case change email.
        iff(
          // generate emailCode and save newEmail.
          hook => (hook.data && hook.data.newEmail && hook.data.password && !hook.data.emailCode),
          getUser(),
          checkPassword(),
          // Make sure both pswd and email are not patched:
          discard('password', 'email'),
          createEmailCode(),
          sendEmailCode({
            From: outboundEmail,
            TemplateId: emailTemplates.changeEmail,
            emailBaseVariables
          })
        ).else(
          // Check pswd and emailCode and set email=newEmail.
          iff(
            hook => (hook.data && hook.data.emailCode),
            getUser(),
            checkPassword(),
            checkEmailCode(),
            hook => {
              hook.data.email = hook.params.user.newEmail
              hook.data.emailCode = ''
              hook.data.newEmail = ''
            }
          )
        )
      ],
      remove: [...restrict]
    },

    after: {
      all: [
        iff(
          isProvider('external'),
          discard('password', 'tempPassword', 'emailCode')
        )
      ],
      find: [],
      get: [],
      create: [
        iff(
          hook => hook.params.existingUser,
          sendDuplicateSignupEmail({
            From: outboundEmail,
            TemplateId: emailTemplates.duplicateSignup,
            emailBaseVariables
          })
        ).else(
          sendWelcomeEmail({
            From: outboundEmail,
            TemplateId: emailTemplates.welcome,
            tempPasswordField: 'tempPasswordPlain',
            emailBaseVariables
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

module.exports.restrict = restrict
