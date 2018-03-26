const paypal = require('paypal-rest-sdk')
const payments = paypal.v1.payments

const defaults = {
  account: 'PAYPAL_ACCOUNT',
  account_type: 'PAYPAL_ACCOUNT_TYPE',
  access_token: 'PAYPAL_ACCESS_TOKEN',
  client_id: 'PAYPAL_CLIENT_ID',
  client_secret: 'PAYPAL_CLIENT_SECRET',
  currency: 'USD'
}

module.exports = function (options = {}) {
  return hook => {
    const payPalSettings = hook.app.get('paypal')
    const currency = hook.app.get('currency')
    options = Object.assign({}, defaults, options, payPalSettings, {currency})

    let env = new paypal.core.SandboxEnvironment(options.client_id, options.client_secret)
    let client = new paypal.core.PayPalHttpClient(env)

    let payment = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      redirect_urls: {
        return_url: 'http://return.url',
        cancel_url: 'http://cancel.url'
      },
      transactions: [{
        item_list: {
          items: hook.params.payPalList
        },
        amount: {
          currency: options.currency,
          total: hook.params.total
        },
        description: 'Payment for items.'
      }]
    }

    let request = new payments.PaymentCreateRequest()
    request.requestBody(payment)

    return client.execute(request).then((response) => {
      hook.data.payPal = { paymentID: response.result.id }
      return hook
    })
  }
}
