const defaults = {
  secret_key: 'STRIPE_SECRET_KEY',
  currency: 'CAD'
}

module.exports = function (options = {}) {
  return hook => {
    const currency = hook.app.get('currency')
    const stripeSettings = hook.app.get('stripe')
    const stripe = require('stripe')(stripeSettings.secret_key)
    options = Object.assign({}, defaults, options, stripeSettings, {currency})

    return new Promise((resolve, reject) => {
      // todo: if user is logged in send stripe email receipt
      stripe.charges.create({
        amount: hook.params.total,
        currency: options.currency,
        description: 'Example charge',
        source: hook.data.stripe.token,
        metadata: {cart_id: hook.data._id}
      }, function (err, charge) {
        if (err) reject(err)
        else resolve(charge)
      })
    })
  }
}
