// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function findUser (hook) {
    const userService = hook.app.service('users')

    return userService.find({query: {email: hook.data.email}})
      .then(users => {
        users = users.data || users
        const user = users[0]
        if (user) {
          hook.params.user = user
        }
        return hook
      })
  }
}
