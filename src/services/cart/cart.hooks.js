const { authenticate } = require('@feathersjs/authentication').hooks
const { restrictToOwner } = require('feathers-authentication-hooks')
const { iff, setCreatedAt, setUpdatedAt, discard } = require('feathers-hooks-common')

const collectTotals = require('./hook.collect-totals')
const authorizedPayPalPayment = require('./hook.authorized-paypal-payment')
const executePayPalPayment = require('./hook.execute-paypal-payment')
const executeStripePayment = require('./hook.execute-stripe-payment')

module.exports = {
  before: {
    all: [],
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
        context => {
          context.data.public = false
          return context
        }
      ),
      setCreatedAt()
    ],
    update: [
      collectTotals(),
      iff(
        hook => (hook.data && hook.data.paymentType === 'paypal' && hook.data.paymentInitiated && hook.data.paymentAuthorized && !hook.data.paymentComplete),
        executePayPalPayment()
      ),
      iff(
        hook => (hook.data && hook.data.paymentType === 'paypal' && hook.data.paymentInitiated && !hook.data.paymentAuthorized && !hook.data.paymentComplete),
        authorizedPayPalPayment()
      ),
      iff(hook => (hook.data && hook.data.paymentType === 'strip' && hook.data.paymentInitiated && hook.data.paymentAuthorized && !hook.data.paymentComplete),
        executeStripePayment()
      ),
      setUpdatedAt()
    ],
    patch: [ setCreatedAt() ],
    remove: []
  },

  after: {
    all: [ discard('__v') ],
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
