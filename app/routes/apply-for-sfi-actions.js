const Joi = require('joi')
const Wreck = require('@hapi/wreck')
const { GET, POST } = require('../constants/http-verbs')
const { WRECK_OPTIONS } = require('../constants/wreck-options')
const { authConfig } = require('../config')
const { getAuthorizationUrl } = require('../auth')
const { USER } = require('../auth/scopes')

module.exports = [{
  method: GET,
  path: '/apply-for-sfi-actions/{actionCode}',
  options: { auth: { strategy: 'jwt', scope: [USER] } },
  handler: async (request, h) => {
    if (request.auth.isAuthenticated) {
      const applicationId = request.query.id
      const actionCode = request.params.actionCode
      const data = await Wreck.get(`http://ffc-tcg-api-gateway:3004/actions/${applicationId}/${actionCode}`, WRECK_OPTIONS())

      return h.view('actions/apply-for-sfi-actions', {
        applicationId,
        actionCode,
        heading: data.payload.content[0].optionDescription.split(' - ')[1],
        content: data.payload.content[0],
        parcels: data.payload.parcels.slice(0, 5)
      })
    }
    if (authConfig.defraIdEnabled) {
      return h.redirect(await getAuthorizationUrl())
    }

    return h.view('sign-in')
  }

},
{
  method: POST,
  path: '/apply-for-sfi-actions',
  options: {
    validate: {
      payload: Joi.object(),
      failAction: async (request, h, _error) => {
        return h.redirect('/action-selection', {
          message: 'You must select an option'
        }).takeover()
      }
    }
  },
  handler: async (request, h) => {
    const { applicationId, actionCode } = request.payload
    await Wreck.post('http://ffc-tcg-api-gateway:3004/actions/submit', WRECK_OPTIONS({ applicationId, actionCode }))
    return h.redirect(`/task-list?id=${applicationId}`)
  }
}]
