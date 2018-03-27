const { authenticate } = require('@feathersjs/authentication').hooks
const { restrictToOwner, restrictToRoles } = require('feathers-authentication-hooks')
const { hashPassword, protect } = require('@feathersjs/authentication-local').hooks
const { softDelete, iff, discard, isProvider, setUpdatedAt, setCreatedAt } = require('feathers-hooks-common') // disallow, isProvider, lowerCase

const restrictOwner = [
  restrictToOwner({
    idField: '_id',
    ownerField: '_id'
  })
]

const restrictRole = [
  restrictToRoles({
    roles: ['admin', 'super-admin', 'manager', 'editor']
  })
]

// const log = (msg, obj) => hook => ((obj ? console.log(msg, obj) : console.log(msg)), hook)

const isExistingUser = require('./hook.is-existing-user')
const isExistingEmail = require('./hook.is-existing-email')
const createTemporaryPassword = require('./hook.create-tmp-password')
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
  const tmpPasswordAddExpiry = app.get('tmpPasswordExpiry')

  return {
    before: {
      all: [ softDelete() ],
      find: [ ...restrictRole ],
      get: [ ...restrictOwner ],
      create: [
        isExistingUser(),
        iff(
          hook => !hook.params.existingUser,
          // If the user has passed a password for account creation, delete it.
          discard('password'), setCreatedAt(), setUpdatedAt(),
          createTemporaryPassword({
            hashedPasswordField: 'tmpPassword',
            plainPasswordField: 'tmpPasswordPlain',
            tmpPasswordAddExpiry
          }),
          hashPassword({
            passwordField: 'tmpPassword',
            timeStampField: 'tmpPasswordCreatedAt'
          })
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
        ...restrictOwner,
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
          // If password gets changed remove the tmpPassword:
          hook => {
            hook.data.isNewUser = false
            hook.data.tmpPassword = null
            hook.data.tmpPasswordTimestampExpiry = null
            hook.data.role = 'user'

            return hook
          },
          setUpdatedAt()
        ),
        // Case change email, but its already is used by another account:
        // If newEmail exists, send emailTemplates.changeEmailDuplicate instead and do not attempt change email address.
        isExistingEmail({emailField: 'newEmail'}),
        iff(
          hook => hook.params.existingEmail,
          // Send email and return browser a success result.
          sendEmailCode({
            From: outboundEmail,
            TemplateId: emailTemplates.changeEmailDuplicate,
            emailBaseVariables
          }),
          hook => {
            // Set result and cleanup data (to skip other hooks):
            hook.result = hook.data
            hook.data = null
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
          }),
          setUpdatedAt()
        ).else(
          // Check password and emailCode and set email=newEmail.
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
      remove: [ ...restrictRole ]
    },

    after: {
      all: [
        discard('__v', 'deleted'),
        iff(
          isProvider('external'),
          discard('password', 'tmpPassword', 'emailCode')
        ),
        protect('password')
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
            tmpPasswordField: 'tmpPasswordPlain',
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

module.exports.restrict = restrictOwner
