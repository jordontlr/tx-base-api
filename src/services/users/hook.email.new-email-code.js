module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function sendEmailCode (hook) {
    if (!hook.app.services) {
      console.warn(`hook.sendEmailCode SKIP since no hook.app.services is available (are you testing?)`)
      return hook
    }

    const postmarkMessages = hook.app.service('postmark-messages')
    const fromAddress = options.From

    if (!fromAddress) {
      throw new Error('A `From` address must be configured for the welcome email hook. Or pass the email in the `hook.data`.')
    }
    if (!options.TemplateId) {
      throw new Error('A `TemplateId` must be configured for the welcome email hook.')
    }
    if (!hook.data.emailCode) {
      throw new Error(`A \`emailCode\` was not found on the \`hook.data\` for the welcome email hook.`)
    }

    const templateModalVars = Object.assign(
      {
        emailVerificationCode: hook.data.emailCode
      },
      options.emailBaseVariables
    )

    const message = {
      From: fromAddress,
      To: hook.data.newEmail,
      TemplateId: options.TemplateId,
      TemplateModel: templateModalVars
    }
    console.log(`hook sending email with emailCode=${hook.data.emailCode}`)
    return postmarkMessages.create(message).then(message => {
      return hook
    })
  }
}
