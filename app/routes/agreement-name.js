const Joi = require('joi')
const Wreck = require('@hapi/wreck')
const { GET, POST } = require('../constants/http-verbs')
const { WRECK_OPTIONS } = require('../constants/wreck-options')
const { authConfig } = require('../config')
const { getAuthorizationUrl } = require('../auth')
const { USER } = require('../auth/scopes')

module.exports = [{
  method: GET,
  path: '/agreement-name',
  options: { auth: { strategy: 'jwt', scope: [USER] } },
  handler: async (request, h) => {
    if (request.auth.isAuthenticated) {
      const applicationId = request.query.id
      const form = await Wreck.get(`http://ffc-tcg-api-gateway:3004/forms/AGREEMENT_NAME/${applicationId}`, WRECK_OPTIONS())

      return h.view('eligibility/agreement-name', {
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
  path: '/agreement-name',
  options: {
    validate: {
      payload: Joi.object({
        AGREEMENT_NAME: Joi.string().required(),
        applicationId: Joi.string().required()
      }),
      failAction: async (request, h, _error) => {
        return h.redirect('/agreement-name', {
          message: 'You must select an option'
        }).takeover()
      }
    }
  },
  handler: async (request, h) => {
    const applicationId = request.payload.applicationId
    const AGREEMENT_NAME = request.payload.AGREEMENT_NAME
    await Wreck.post(`http://ffc-tcg-api-gateway:3004/forms/submit/AGREEMENT_NAME/${applicationId}`, WRECK_OPTIONS({ AGREEMENT_NAME }))
    return h.redirect(`/task-list?id=${applicationId}`)
  }
}]
