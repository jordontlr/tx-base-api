
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function findUser (hook) {
    if (hook.params && hook.params.user && hook.id === hook.params.user._id) {
      return hook
    }
    const userService = hook.service
    const id = hook.id

    return userService.get(id)
      .then(user => {
        hook.params.user = user
        return hook
      })
  }
}
