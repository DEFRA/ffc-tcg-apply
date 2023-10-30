
const Wreck = require('@hapi/wreck')
const { GET } = require('../constants/http-verbs')
const { WRECK_OPTIONS } = require('../constants/wreck-options')
const { authConfig } = require('../config')
const { getAuthorizationUrl } = require('../auth')
const { USER } = require('../auth/scopes')

module.exports = [{
  method: GET,
  path: '/task-list',
  options: { auth: { strategy: 'jwt', scope: [USER] } },
  handler: async (request, h) => {
    if (request.auth.isAuthenticated) {
      const applicationSummary = await Wreck.get('http://ffc-tcg-api-gateway:3004/applications/status/142', WRECK_OPTIONS())
      return h.view('task-list', { ...applicationSummary.payload })
    }
    if (authConfig.defraIdEnabled) {
      return h.redirect(await getAuthorizationUrl())
    }

    return h.view('sign-in')
  }

}]
