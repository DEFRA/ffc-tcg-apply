const { GET } = require('../constants/http-verbs')
const { REVIEW } = require('../constants/abaco-transitions')
const { PARTY_ID } = require('../constants/party-id')
const { getAuthorizationUrl } = require('../auth')
const { USER } = require('../auth/scopes')
const { authConfig } = require('../config')
const { transitionApplication } = require('../processing/transition-application')
const { asyncRetry } = require('../processing/async-retry')

module.exports = [{
  method: GET,
  path: '/check-your-answers',
  options: { auth: { strategy: 'jwt', scope: [USER] } },
  handler: async (request, h) => {
    if (request.auth.isAuthenticated) {
      const applicationId = request.query.id
      await transitionApplication(applicationId, REVIEW, request.state.tcg_auth_token)
      const data = await asyncRetry({
        method: GET,
        url: `http://ffc-tcg-api-gateway:3004/applications/review/${PARTY_ID}/${applicationId}`,
        auth: request.state.tcg_auth_token
      })

      return h.view('check-your-answers', {
        applicationId,
        data
      })
    }

    if (authConfig.defraIdEnabled) {
      return h.redirect(await getAuthorizationUrl())
    }

    return h.view('sign-in')
  }

}]
