const Joi = require('joi')
const Wreck = require('@hapi/wreck')
const { GET, POST } = require('../constants/http-verbs')
const { WRECK_OPTIONS } = require('../constants/wreck-options')
const { PARTY_ID } = require('../constants/party-id')
const { authConfig } = require('../config')
const { getAuthorizationUrl } = require('../auth')
const { USER } = require('../auth/scopes')

module.exports = [{
  method: GET,
  path: '/start-application',
  options: { auth: { strategy: 'jwt', scope: [USER] } },
  handler: async (request, h) => {
    if (request.auth.isAuthenticated) {
      const partyDetails = await Wreck.get(`http://ffc-tcg-api-gateway:3004/parties/${PARTY_ID}`, WRECK_OPTIONS())
      const eligibleOrgaisations = await Wreck.get(`http://ffc-tcg-api-gateway:3004/applications/summary/${PARTY_ID}`, WRECK_OPTIONS())

      return h.view('start-application',
        {
          partyId: partyDetails.payload.id,
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
    const partyId = request.payload.partyId
    const application = await Wreck.post(`http://ffc-tcg-api-gateway:3004/applications/create/${partyId}`, WRECK_OPTIONS({ partyId }))
    return h.redirect(`/task-list?id=${application.payload.applicationId}`)
  }
}]
