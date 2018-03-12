module.exports = function (options) {
  return hook => {
    hook.data.linkTitle = hook.data.title.toLowerCase().replace(/[^A-Za-z0-9\s]/g, '').trim().replace(/[\s]/g, '-').replace('--', '-')

    return Promise.resolve(hook)
  }
}
