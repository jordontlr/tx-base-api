module.exports = function (options) {
  return hook => {
    hook.data.linkTitle = hook.data.title.toLowerCase().replace(/[^A-Za-z0-9\s]/g,'').replace(/[\s]/g,'-')

    return hook
  }
}
