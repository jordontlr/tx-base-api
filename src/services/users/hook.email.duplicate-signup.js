const defaults = {
  From: undefined,
  TemplateId: undefined,
  tmpPasswordField: 'tmpPassword'
}

module.exports = function (options = {}) {
  options = Object.assign({}, defaults, options)

  return hook => {
    const postmarkMessages = hook.app.service('postmark-messages')
    const fromAddress = options.From

    if (!fromAddress) {
      throw new Error('A `From` address must be configured for the welcome email hook. Or pass the email in the `hook.data`.')
    }
    if (!options.TemplateId) {
      throw new Error('A `TemplateId` must be configured for the welcome email hook.')
    }

    const message = {
      From: fromAddress,
      To: hook.data.email,
      TemplateId: options.TemplateId,
      TemplateModel: options.emailBaseVariables
    }
    return postmarkMessages.create(message).then(message => {
      return hook
    })
  }
}
