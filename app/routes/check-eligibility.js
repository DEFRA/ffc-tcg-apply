const Joi = require('joi')
const Wreck = require('@hapi/wreck')
const { GET, POST } = require('../constants/http-verbs')
const { WRECK_OPTIONS } = require('../constants/wreck-options')
const { authConfig } = require('../config')
const { getAuthorizationUrl } = require('../auth')
const { USER } = require('../auth/scopes')

module.exports = [{
  method: GET,
  path: '/check-eligibility',
  options: { auth: { strategy: 'jwt', scope: [USER] } },
  handler: async (request, h) => {
    const applicationId = request.query.id
    if (request.auth.isAuthenticated) {
      const form = await Wreck.get(`http://ffc-tcg-api-gateway:3004/forms/CHECK_AND_CONFIRM_LAND_DETAILS/${applicationId}`, WRECK_OPTIONS())

      return h.view('eligibility/check-land-details', {
        applicationId,
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
  path: '/check-eligibility',
  options: {
    validate: {
      payload: Joi.object({
        IS_LAND_UPTODATE: Joi.string().required(),
        applicationId: Joi.string().required()
      }),
      failAction: async (request, h, _error) => {
        return h.redirect('/check-land-details', {
          message: 'You must select an option'
        }).takeover()
      }
    }
  },
  handler: async (request, h) => {
    const applicationId = request.payload.applicationId
    const IS_LAND_UPTODATE = request.payload.IS_LAND_UPTODATE
    await Wreck.post(`http://ffc-tcg-api-gateway:3004/forms/submit/CHECK_AND_CONFIRM_LAND_DETAILS/${applicationId}`, WRECK_OPTIONS({ IS_LAND_UPTODATE }))
    return h.redirect(`/confirm-management-control?id=${applicationId}`)
  }
}]
