const { GET } = require('../constants/http-verbs')
const { PARTY_ID } = require('../constants/party-id')
const { authConfig, serverConfig } = require('../config')
const { getAuthorizationUrl } = require('../auth')
const { USER } = require('../auth/scopes')
const { asyncRetry } = require('../processing/async-retry')

module.exports = [{
  method: GET,
  path: '/eligible-organisations',
  options: { auth: { strategy: 'jwt', scope: [USER] } },
  handler: async (request, h) => {
    if (request.auth.isAuthenticated) {
      const partyDetails = await asyncRetry({
        method: GET,
        url: `${serverConfig.apiEndpoint}/parties/${PARTY_ID}`,
        auth: request.state.tcg_auth_token
      })

      const eligibleOrgaisations = await asyncRetry({
        method: GET,
        url: `${serverConfig.apiEndpoint}/applications/summary/${PARTY_ID}`,
        auth: request.state.tcg_auth_token
      })

      return h.view('eligible-organisations', {
        id: partyDetails.id,
        partyName: partyDetails.lastName,
        applications: eligibleOrgaisations.records,
        numberOfApplications: eligibleOrgaisations.applicationsSummaryByYear[0].applicationsNumber
      })
    }

    if (authConfig.defraIdEnabled) {
      return h.redirect(await getAuthorizationUrl())
    }

    return h.view('sign-in')
  }

}]
