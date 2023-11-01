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
      const form = await Wreck.get('http://ffc-tcg-api-gateway:3004/forms/CONFIRM_ELIGIBILITY_TO_APPLY/142', WRECK_OPTIONS())

      return h.view('eligibility/confirm-management-control', {
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
        CONFIRM_ELIGIBILITY_TO_APPLY: Joi.string().required()
      }),
      failAction: async (request, h, _error) => {
        return h.redirect('/confirm-management-control', {
          message: 'You must select an option'
        }).takeover()
      }
    }
  },
  handler: async (request, h) => {
    await Wreck.post('http://ffc-tcg-api-gateway:3004/forms/submit/CONFIRM_ELIGIBILITY_TO_APPLY/142', WRECK_OPTIONS({ ...request.payload }))
    return h.redirect('/agreement-name')
  }
}]
