
module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function findUser (hook) {
    const userService = hook.service
    const id = hook.id

    return userService.get(id)
      .then(user => {
        hook.params.user = user
        return hook
      })
  }
}
