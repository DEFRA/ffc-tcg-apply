const Joi = require('joi')
const { GET, POST } = require('../constants/http-verbs')
const { APPLY } = require('../constants/abaco-transitions')
const { authConfig } = require('../config')
const { getAuthorizationUrl } = require('../auth')
const { USER } = require('../auth/scopes')
const { mapActionSelections } = require('../processing/map-action-selections')
const { transitionApplication } = require('../processing/transition-application')
const { asyncRetry } = require('../processing/async-retry')

module.exports = [{
  method: GET,
  path: '/action-selection',
  options: { auth: { strategy: 'jwt', scope: [USER] } },
  handler: async (request, h) => {
    if (request.auth.isAuthenticated) {
      const applicationId = request.query.id
      const availableActions = await asyncRetry({ method: GET, url: `http://ffc-tcg-api-gateway:3004/actions/${applicationId}` })

      return h.view('actions/available-actions', {
        applicationId,
        availableActions
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
  path: '/action-selection',
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
    // TODO transition the application to action selection state if it is not in that state
    const { applicationId } = request.payload
    delete request.payload.applicationId
    // TODO set actions not selected to false
    const mappedActions = mapActionSelections(request.payload)
    await asyncRetry({ method: POST, url: `http://ffc-tcg-api-gateway:3004/actions/${applicationId}`, payload: { applicationId, mappedActions } })
    await transitionApplication(applicationId, APPLY)
    return h.redirect(`/task-list?id=${applicationId}`)
  }
}]

// TODO fix all backlinks
// TODO use asyncRetry for all requests
