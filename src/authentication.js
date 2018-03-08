const authentication = require('@feathersjs/authentication')
const jwt = require('@feathersjs/authentication-jwt')
const local = require('@feathersjs/authentication-local')
const oauth2 = require('@feathersjs/authentication-oauth2')
const GoogleStrategy = require('passport-google-oauth20')
const FacebookStrategy = require('passport-facebook')
const GithubStrategy = require('passport-github')
const MyVerifier = require('./authentication-verifier')

module.exports = function (app) {
  const config = app.get('authentication')

  // Set up authentication with the secret
  app.configure(authentication(config))
  app.configure(jwt())
  app.configure(local({
    tmpPasswordField: 'tmpPassword',
    Verifier: MyVerifier
  }))

  app.configure(oauth2(Object.assign({
    name: 'google',
    Strategy: GoogleStrategy
  }, config.google)))

  app.configure(oauth2(Object.assign({
    name: 'facebook',
    Strategy: FacebookStrategy
  }, config.facebook)))

  app.configure(oauth2(Object.assign({
    name: 'github',
    Strategy: GithubStrategy
  }, config.github)))

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      create: [
        authentication.hooks.authenticate(config.strategies)
      ],
      remove: [
        authentication.hooks.authenticate('jwt')
      ]
    },
    after: {
      create: [
        // Return user to avoid extra request.
        // Add `tmpPasswordUsed` flag if necessary.
        hook => {
          if (hook.params.user.tmpPasswordUsed && hook.params.user.tmpPassword) {
            hook.result.tmpPasswordUsed = true
          }
          hook.result.user = hook.params.user
          delete hook.result.user.password
          delete hook.result.user.tmpPassword
          delete hook.result.user.tmpPasswordUsed
          return hook
        }
      ]
    }
  })
}
