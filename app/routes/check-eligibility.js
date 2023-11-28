const Joi = require('joi')
const { GET, POST } = require('../constants/http-verbs')
const { authConfig, serverConfig } = require('../config')
const { getAuthorizationUrl } = require('../auth')
const { USER } = require('../auth/scopes')
const { asyncRetry } = require('../processing/async-retry')

module.exports = [{
  method: GET,
  path: '/check-eligibility',
  options: { auth: { strategy: 'jwt', scope: [USER] } },
  handler: async (request, h) => {
    const applicationId = request.query.id
    if (request.auth.isAuthenticated) {
      const form = await asyncRetry({
        method: GET,
        url: `${serverConfig.apiEndpoint}/forms/CHECK_AND_CONFIRM_LAND_DETAILS/${applicationId}`,
        auth: request.state.tcg_auth_token
      })

      return h.view('eligibility/check-land-details', {
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
    await asyncRetry({
      method: POST,
      url: `${serverConfig.apiEndpoint}/forms/submit/CHECK_AND_CONFIRM_LAND_DETAILS/${applicationId}`,
      payload: { IS_LAND_UPTODATE },
      auth: request.state.tcg_auth_token
    })

    return h.redirect(`/confirm-management-control?id=${applicationId}`)
  }
}]
