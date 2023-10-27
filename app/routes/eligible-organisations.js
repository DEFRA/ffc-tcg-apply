
const Wreck = require('@hapi/wreck')
const { GET } = require('../constants/http-verbs')
const { WRECK_OPTIONS } = require('../constants/wreck-options')
const { authConfig } = require('../config')
const { getAuthorizationUrl } = require('../auth')
const { USER } = require('../auth/scopes')

module.exports = [{
  method: GET,
  path: '/eligible-organisations',
  options: { auth: { strategy: 'jwt', scope: [USER] } },
  handler: async (request, h) => {
    if (request.auth.isAuthenticated) {
      const partyDetails = await Wreck.get('http://ffc-tcg-api-gateway:3004/parties/389409', WRECK_OPTIONS())
      const eligibleOrgaisations = await Wreck.get('http://ffc-tcg-api-gateway:3004/applications/summary/389409', WRECK_OPTIONS())

      return h.view('eligible-organisations', {
        id: partyDetails.payload.id,
        partyName: partyDetails.payload.lastName,
        applications: eligibleOrgaisations.payload.records,
        numberOfApplications: eligibleOrgaisations.payload.applicationsSummaryByYear[0].applicationsNumber
      })
    }
    if (authConfig.defraIdEnabled) {
      return h.redirect(await getAuthorizationUrl())
    }

    return h.view('sign-in')
  }

}]
