const defaults = {
  findByField: 'email',
  existingUserField: 'existingUser'
}

// Check if the user already exists.
module.exports = function (options = {}) {
  options = Object.assign({}, defaults, options)

  return hook => {
    let userService = hook.service
    let query = {
      // For example: { email: hook.data.email }
      [options.findByField]: hook.data[options.findByField]
    }

    return userService.find({ query })
      .then(users => {
        users = users.data || users
        let user = users[0]
        // User already signed up.
        console.log(`[hook.is-existing] ${hook.data[options.findByField]}`)
        if (user) {
          console.log(`- existing user`)
          hook.params.existingUser = user
          // Set hook.result, so the call to the database will be skipped.
          hook.result = { email: hook.data.email }
        } else {
          console.log(`- NON-existing user`)
          hook.data.isNewUser = true
        }
        return hook
      })
  }
}
