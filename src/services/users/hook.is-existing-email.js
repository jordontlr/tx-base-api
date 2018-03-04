const defaults = {
  emailField: 'email'
}

// Check if the user already exists.
module.exports = function (options = {}) {
  options = Object.assign({}, defaults, options)

  return hook => {
    let userService = hook.service
    if (!userService) {
      return hook
    }

    let query = {
      email: hook.data[options.emailField]
    }

    return userService.find({ query })
      .then(users => {
        users = users.data || users
        let user = users[0]
        // User already signed up.
        console.log(`[hook.is-existing] ${hook.data[options.findByField]}`)
        if (user) {
          console.log(`- existing email`)
          hook.params.existingEmail = true
        }
        return hook
      })
  }
}
