const Joi = require('joi')
const { GET, POST } = require('../constants/http-verbs')
const { SUBMIT } = require('../constants/abaco-transitions')
const { getAuthorizationUrl } = require('../auth')
const { USER } = require('../auth/scopes')
const { authConfig } = require('../config')
const { transitionApplication } = require('../processing/transition-application')

module.exports = [{
  method: GET,
  path: '/submit-your-application',
  options: { auth: { strategy: 'jwt', scope: [USER] } },
  handler: async (request, h) => {
    if (request.auth.isAuthenticated) {
      const applicationId = request.query.id
      return h.view('submit-your-application', {
        applicationId
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
  path: '/submit-your-application',
  options: {
    validate: {
      payload: {
        applicationId: Joi.string().required()
      },
      failAction: async (request, h, _error) => {
        return h.redirect('/submit-your-application', {
          message: 'You must select an option'
        }).takeover()
      }
    }
  },
  handler: async (request, h) => {
    const { applicationId } = request.payload
    await transitionApplication(applicationId, SUBMIT, request.state.tcg_auth_token)
    return h.redirect(`/confirmation?id=${applicationId}`)
  }
}]
