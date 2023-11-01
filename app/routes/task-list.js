
const Wreck = require('@hapi/wreck')
const { GET } = require('../constants/http-verbs')
const { WRECK_OPTIONS } = require('../constants/wreck-options')
const { authConfig } = require('../config')
const { getAuthorizationUrl } = require('../auth')
const { USER } = require('../auth/scopes')

module.exports = [{
  method: GET,
  path: '/task-list',
  options: { auth: { strategy: 'jwt', scope: [USER] } },
  handler: async (request, h) => {
    const applicationId = request.query.id
    if (request.auth.isAuthenticated) {
      const applicationSummary = await Wreck.get(`http://ffc-tcg-api-gateway:3004/applications/status/${applicationId}`, WRECK_OPTIONS())
      const sectionStatus = [...new Set(applicationSummary.payload.status.forms.map(form => form.formDetails.compileStatus))]

      return h.view('task-list', {
        applicationId: applicationSummary.payload.status.applicationId,
        applicationStatus: applicationSummary.payload.status.processStatusDescription,
        section: {
          name: applicationSummary.payload.status.forms[0].formDetails.formName,
          url: `${applicationSummary.payload.status.forms[0].formDetails.routerUrl}?id=${applicationId}`,
          status: sectionStatus.length > 1 ? 'In progress' : sectionStatus[0]
        },
        ...applicationSummary.payload
      })
    }
    if (authConfig.defraIdEnabled) {
      return h.redirect(await getAuthorizationUrl())
    }

    return h.view('sign-in')
  }

}]
