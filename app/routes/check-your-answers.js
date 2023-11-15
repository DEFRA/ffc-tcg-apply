
const Wreck = require('@hapi/wreck')
const { GET } = require('../constants/http-verbs')
const { authConfig } = require('../config')
const { getAuthorizationUrl } = require('../auth')
const { WRECK_OPTIONS } = require('../constants/wreck-options')
const { USER } = require('../auth/scopes')
const { PARTY_ID } = require('../constants/party-id')

module.exports = [{
  method: GET,
  path: '/check-your-answers',
  options: { auth: { strategy: 'jwt', scope: [USER] } },
  handler: async (request, h) => {
    // TODO transition the application to Review
    const applicationId = request.query.id
    const data = await Wreck.get(`http://ffc-tcg-api-gateway:3004/applications/review/${PARTY_ID}/${applicationId}`, WRECK_OPTIONS())
    if (request.auth.isAuthenticated) {
      return h.view('check-your-answers', {
        applicationId,
        data: data.payload
      })
    }
    if (authConfig.defraIdEnabled) {
      return h.redirect(await getAuthorizationUrl())
    }

    return h.view('sign-in')
  }

}]
