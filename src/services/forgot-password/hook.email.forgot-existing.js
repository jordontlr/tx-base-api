const defaults = {
  From: undefined,
  TemplateId: undefined,
  tmpPasswordField: undefined
}

module.exports = function (options = {}) {
  options = Object.assign({}, defaults, options)

  return hook => {
    const postmarkMessages = hook.app.service('postmark-messages')
    const fromAddress = hook.data.From || options.From

    if (!fromAddress) {
      throw new Error('A `From` address must be configured for the welcome email hook. Or pass the email in the `hook.data`.')
    }
    if (!options.TemplateId) {
      throw new Error('A `TemplateId` must be configured for the welcome email hook.')
    }
    if (!hook.data[options.tmpPasswordField]) {
      throw new Error(`A \`${options.tmpPasswordField}\` was not found on the \`hook.data\` for the welcome email hook.`)
    }

    const templateModalVars = Object.assign(
      {
        tmpPassword: hook.data[options.tmpPasswordField],
        operatingSystem: (hook.params.userAgent && hook.params.userAgent.os.family) || '',
        browserName: (hook.params.userAgent && `${hook.params.userAgent.family} ${hook.params.userAgent.major}`)
      },
      options.emailBaseVariables
    )

    const message = {
      From: fromAddress,
      To: hook.data.email,
      TemplateId: options.TemplateId,
      TemplateModel: templateModalVars
    }
    return postmarkMessages.create(message).then(message => {
      return hook
    })
  }
}
