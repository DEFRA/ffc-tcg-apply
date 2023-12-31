const { GET } = require('../constants/http-verbs')
const { authConfig, serverConfig } = require('../config')
const { getAuthorizationUrl } = require('../auth')
const { USER } = require('../auth/scopes')
const { getFormData } = require('../processing/get-form-data')
const { asyncRetry } = require('../processing/async-retry')

module.exports = [{
  method: GET,
  path: '/task-list',
  options: { auth: { strategy: 'jwt', scope: [USER] } },
  handler: async (request, h) => {
    if (request.auth.isAuthenticated) {
      const applicationId = request.query.id
      const applicationSummary = await asyncRetry({
        method: GET,
        url: `${serverConfig.apiEndpoint}/applications/status/${applicationId}`,
        auth: request.state.tcg_auth_token
      })
      const forms = getFormData(applicationSummary.status.forms)
      const sectionsCompleted = forms.filter(form => form.availableForms.compileStatus === 'COMPLETED')

      return h.view('task-list', {
        applicationId: applicationSummary.status.applicationId,
        applicationStatus: applicationSummary.status.processStatusDescription,
        forms,
        sectionsCompleted
      })
    }
    if (authConfig.defraIdEnabled) {
      return h.redirect(await getAuthorizationUrl())
    }

    return h.view('sign-in')
  }

}]
