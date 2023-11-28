const Joi = require('joi')
const { GET, POST } = require('../constants/http-verbs')
const { authConfig, serverConfig } = require('../config')
const { getAuthorizationUrl } = require('../auth')
const { USER } = require('../auth/scopes')
const { asyncRetry } = require('../processing/async-retry')

module.exports = [{
  method: GET,
  path: '/apply-for-sfi-actions/{actionCode}',
  options: { auth: { strategy: 'jwt', scope: [USER] } },
  handler: async (request, h) => {
    if (request.auth.isAuthenticated) {
      const applicationId = request.query.id
      const actionCode = request.params.actionCode
      const data = await asyncRetry({
        method: GET,
        url: `${serverConfig.apiEndpoint}/actions/${applicationId}/${actionCode}`,
        auth: request.state.tcg_auth_token
      })

      return h.view('actions/apply-for-sfi-actions', {
        applicationId,
        actionCode,
        heading: data.content[0].optionDescription.split(' - ')[1],
        content: data.content[0],
        parcels: data.parcels.slice(0, 5)
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
    await asyncRetry({
      method: POST,
      url: `${serverConfig.apiEndpoint}/actions/submit`,
      payload: { applicationId, actionCode },
      auth: request.state.tcg_auth_token
    })
    return h.redirect(`/task-list?id=${applicationId}`)
  }
}]
