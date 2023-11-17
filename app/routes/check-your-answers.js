
const Wreck = require('@hapi/wreck')
const { GET } = require('../constants/http-verbs')
const { REVIEW } = require('../constants/abaco-transitions')
const { WRECK_OPTIONS } = require('../constants/wreck-options')
const { PARTY_ID } = require('../constants/party-id')
const { getAuthorizationUrl } = require('../auth')
const { USER } = require('../auth/scopes')
const { authConfig } = require('../config')
const { transitionApplication } = require('../processing/transition-application')

module.exports = [{
  method: GET,
  path: '/check-your-answers',
  options: { auth: { strategy: 'jwt', scope: [USER] } },
  handler: async (request, h) => {
    // TODO transition the application to Review
    const applicationId = request.query.id
    await transitionApplication(applicationId, REVIEW)
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
