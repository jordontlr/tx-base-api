const { authenticate } = require('@feathersjs/authentication').hooks
const { restrictToOwner } = require('feathers-authentication-hooks')
const { softDelete, iff, setCreatedAt, setUpdatedAt, discard } = require('feathers-hooks-common')

// const collectTotals = require('./hook.collectTotals')
// const readyPayPalAuth = require('./hook.ready-paypal-auth')
// const completePayPalPayment = require('./hook.complete-paypal-payment')

module.exports = {
  before: {
    all: [ softDelete() ],
    find: [
      authenticate('jwt'),
      restrictToOwner()
    ],
    get: [
      iff(
        context => context.params.authenticated,
        authenticate('jwt'),
        restrictToOwner()
      ).else(
        context => {
          Object.assign(context.params.query, { public: true })
          return context
        }
      )
    ],
    create: [
      iff(
        context => context.params.authenticated,
        context => context.data.public = false
      ),
      setCreatedAt()
    ],
    update: [
      iff(
        hook => (hook.data && hook.data.paymentType === 'paypal' && hook.data.initiatedPayment && !hook.data.paymentProcessId && !hook.data.paymentClientId),
        // collectTotals(),
        // readyPayPalAuth(),
        setUpdatedAt()
      ),
      iff(
        hook => (hook.data && hook.data.paymentType === 'paypal' && hook.data.initiatedPayment && hook.data.paymentProcessId && hook.data.paymentClientId),
        // completePayPalPayment(),
        setUpdatedAt()
      ),
    ],
    patch: [ setUpdatedAt() ],
    remove: [ setUpdatedAt() ]
  },

  after: {
    all: [ discard('__v', 'deleted') ],
    find: [],
    get: [],
    create: [],
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
