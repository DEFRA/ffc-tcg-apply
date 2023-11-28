const Joi = require('joi')
const { GET, POST } = require('../constants/http-verbs')
const { PARTY_ID } = require('../constants/party-id')
const { authConfig } = require('../config')
const { getAuthorizationUrl } = require('../auth')
const { USER } = require('../auth/scopes')
const { asyncRetry } = require('../processing/async-retry')

module.exports = [{
  method: GET,
  path: '/start-application',
  options: { auth: { strategy: 'jwt', scope: [USER] } },
  handler: async (request, h) => {
    if (request.auth.isAuthenticated) {
      const partyDetails = await asyncRetry({
        method: GET,
        url: `http://ffc-tcg-api-gateway:3004/parties/${PARTY_ID}`,
        auth: request.state.tcg_auth_token
      })
      // only returns first 10 applications due to AbacoAPI using pagination
      const eligibleOrgaisations = await asyncRetry({
        method: GET,
        url: `http://ffc-tcg-api-gateway:3004/applications/summary/${PARTY_ID}`,
        auth: request.state.tcg_auth_token
      })

      return h.view('start-application',
        {
          partyId: partyDetails.id,
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

},
{
  // convert this to create a new application
  method: POST,
  path: '/start-application',
  options: {
    validate: {
      payload: Joi.object({
        partyId: Joi.string().required()
      }),
      failAction: async (request, h, _error) => {
        return h.redirect('/start-application', {
          message: 'You must select an option'
        }).takeover()
      }
    }
  },
  handler: async (request, h) => {
    // TODO fix applictiuon crashing when creating new application
    const partyId = request.payload.partyId
    const application = await asyncRetry({
      method: POST,
      url: `http://ffc-tcg-api-gateway:3004/applications/create/${partyId}`,
      payload: { partyId },
      auth: request.state.tcg_auth_token
    })
    return h.redirect(`/task-list?id=${application.applicationId}`)
  }
}]
