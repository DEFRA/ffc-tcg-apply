const Joi = require('joi')
const Wreck = require('@hapi/wreck')
const { GET, POST } = require('../constants/http-verbs')
const { WRECK_OPTIONS } = require('../constants/wreck-options')
const { authConfig } = require('../config')
const { getAuthorizationUrl } = require('../auth')
const { USER } = require('../auth/scopes')

module.exports = [{
  method: GET,
  path: '/check-land-details',
  options: { auth: { strategy: 'jwt', scope: [USER] } },
  handler: async (request, h) => {
    if (request.auth.isAuthenticated) {
      const form = await Wreck.get('http://ffc-tcg-api-gateway:3004/forms/CHECK_AND_CONFIRM_LAND_DETAILS/142', WRECK_OPTIONS())

      return h.view('eligibility/check-land-details', {
        contentTitle: form.payload.formContent.description,
        contentDescription: form.payload.formContent.fieldSets[0].fields[0].label.en,
        formCode: form.payload.formContent.fieldSets[0].fields[1].code
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
  path: '/check-land-details',
  options: {
    validate: {
      payload: Joi.object({
        IS_LAND_UPTODATE: Joi.string().required()
      }),
      failAction: async (request, h, _error) => {
        return h.redirect('/check-land-details', {
          message: 'You must select an option'
        }).takeover()
      }
    }
  },
  handler: async (request, h) => {
    const payload = {
      ...request.payload
    }
    await Wreck.post('http://ffc-tcg-api-gateway:3004/forms/submit/CHECK_AND_CONFIRM_LAND_DETAILS/142', WRECK_OPTIONS(payload))
    return h.redirect('/confirm-management-control')
  }
}]
