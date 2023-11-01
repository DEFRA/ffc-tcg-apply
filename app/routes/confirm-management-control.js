const Joi = require('joi')
const Wreck = require('@hapi/wreck')
const { GET, POST } = require('../constants/http-verbs')
const { WRECK_OPTIONS } = require('../constants/wreck-options')
const { authConfig } = require('../config')
const { getAuthorizationUrl } = require('../auth')
const { USER } = require('../auth/scopes')

module.exports = [{
  method: GET,
  path: '/confirm-management-control',
  options: { auth: { strategy: 'jwt', scope: [USER] } },
  handler: async (request, h) => {
    if (request.auth.isAuthenticated) {
      const applicationId = request.query.id
      const form = await Wreck.get(`http://ffc-tcg-api-gateway:3004/forms/CONFIRM_ELIGIBILITY_TO_APPLY/${applicationId}`, WRECK_OPTIONS())

      return h.view('eligibility/confirm-management-control', {
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
  path: '/confirm-management-control',
  options: {
    validate: {
      payload: Joi.object({
        CONFIRM_ELIGIBILITY_TO_APPLY: Joi.string().required(),
        applicationId: Joi.string().required()
      }),
      failAction: async (request, h, _error) => {
        return h.redirect('/confirm-management-control', {
          message: 'You must select an option'
        }).takeover()
      }
    }
  },
  handler: async (request, h) => {
    const applicationId = request.payload.applicationId
    const CONFIRM_ELIGIBILITY_TO_APPLY = request.payload.CONFIRM_ELIGIBILITY_TO_APPLY
    await Wreck.post(`http://ffc-tcg-api-gateway:3004/forms/submit/CONFIRM_ELIGIBILITY_TO_APPLY/${applicationId}`, WRECK_OPTIONS({ CONFIRM_ELIGIBILITY_TO_APPLY }))
    return h.redirect(`/agreement-name?id=${applicationId}`)
  }
}]
