const Joi = require('joi')
const { GET, POST } = require('../constants/http-verbs')
const { ACTION_SELECTION } = require('../constants/abaco-transitions')
const { authConfig } = require('../config')
const { getAuthorizationUrl } = require('../auth')
const { USER } = require('../auth/scopes')
const { transitionApplication } = require('../processing/transition-application')
const { asyncRetry } = require('../processing/async-retry')

module.exports = [{
  method: GET,
  path: '/agreement-name',
  options: { auth: { strategy: 'jwt', scope: [USER] } },
  handler: async (request, h) => {
    if (request.auth.isAuthenticated) {
      const applicationId = request.query.id
      const form = await asyncRetry({ method: GET, url: `http://ffc-tcg-api-gateway:3004/forms/AGREEMENT_NAME/${applicationId}` })

      return h.view('eligibility/agreement-name', {
        applicationId,
        contentTitle: form.formContent.description,
        contentDescription: form.formContent.fieldSets[0].fields[0].label.en,
        formCode: form.formContent.fieldSets[0].fields[1].code
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
    await asyncRetry({ method: POST, url: `http://ffc-tcg-api-gateway:3004/forms/submit/AGREEMENT_NAME/${applicationId}`, payload: { AGREEMENT_NAME } })
    await transitionApplication(applicationId, ACTION_SELECTION)
    return h.redirect(`/task-list?id=${applicationId}`)
  }
}]
