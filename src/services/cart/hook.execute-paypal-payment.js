const paypal = require('paypal-rest-sdk')
const payments = paypal.v1.payments

const defaults = {
  account: 'PAYPAL_ACCOUNT',
  account_type: 'PAYPAL_ACCOUNT_TYPE',
  access_token: 'PAYPAL_ACCESS_TOKEN',
  client_id: 'PAYPAL_CLIENT_ID',
  client_secret: 'PAYPAL_CLIENT_SECRET',
  currency: 'CAD'
}

module.exports = function (options = {}) {
  return hook => {
    const payPalSettings = hook.app.get('paypal')
    const currency = hook.app.get('currency')
    options = Object.assign({}, defaults, options, payPalSettings, {currency})

    let env = new paypal.core.SandboxEnvironment(options.client_id, options.client_secret)
    let client = new paypal.core.PayPalHttpClient(env)

    let executePaymentJson = {
      payer_id: hook.data.payPal.payerID,
      transactions: [{
        amount: {
          currency: currency,
          total: hook.params.total
        }
      }]
    }

    let request = new payments.PaymentExecuteRequest(hook.data.payPal.paymentID)
    request.requestBody(executePaymentJson)

    return client.execute(request).then((response) => {
      console.log(`[hook.execute-paypal-payment] ${response.result.id}`)
      hook.data.payPal = Object.assign(hook.data.payPal, {executeResponse: response.result})
      hook.data.paymentComplete = true
      return hook
    })
  }
}
