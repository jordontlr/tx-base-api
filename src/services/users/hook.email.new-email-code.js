module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function sendEmailCode (hook) {
    const postmarkMessages = hook.app.service('postmark-messages')
    const fromAddress = options.From

    if (!fromAddress) {
      throw new Error('A `From` address must be configured for the welcome email hook. Or pass the email in the `hook.data`.')
    }
    if (!options.TemplateId) {
      throw new Error('A `TemplateId` must be configured for the welcome email hook.')
    }
    if (!hook.data[options.emailCode]) {
      throw new Error(`A \`${options.emailCode}\` was not found on the \`hook.data\` for the welcome email hook.`)
    }

    const message = {
      From: fromAddress,
      To: hook.data.newEmail,
      TemplateId: options.TemplateId,
      TemplateModel: {
        emailCode: hook.data[options.emailCode]
      }
    }
    return postmarkMessages.create(message).then(message => {
      return hook
    })
  }
}
