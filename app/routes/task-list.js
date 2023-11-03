
const Wreck = require('@hapi/wreck')
const { GET } = require('../constants/http-verbs')
const { WRECK_OPTIONS } = require('../constants/wreck-options')
const { authConfig } = require('../config')
const { getAuthorizationUrl } = require('../auth')
const { USER } = require('../auth/scopes')
const { getFormData } = require('../processing/get-form-data')

module.exports = [{
  method: GET,
  path: '/task-list',
  options: { auth: { strategy: 'jwt', scope: [USER] } },
  handler: async (request, h) => {
    const applicationId = request.query.id
    if (request.auth.isAuthenticated) {
      const applicationSummary = await Wreck.get(`http://ffc-tcg-api-gateway:3004/applications/status/${applicationId}`, WRECK_OPTIONS())

      return h.view('task-list', {
        applicationId: applicationSummary.payload.status.applicationId,
        applicationStatus: applicationSummary.payload.status.processStatusDescription,
        forms: getFormData(applicationSummary.payload.status.forms)
      })
    }
    if (authConfig.defraIdEnabled) {
      return h.redirect(await getAuthorizationUrl())
    }

    return h.view('sign-in')
  }

}]
