const { GET, PATCH } = require('../constants/http-verbs')
const { serverConfig } = require('../config')
const { asyncRetry } = require('../processing/async-retry')
const { checkTransitionStatus } = require('./check-transition-status')

const transitionApplication = async (applicationId, destination, authToken) => {
  const applicationSummary = await asyncRetry({
    method: GET,
    url: `${serverConfig.apiEndpoint}/applications/status/${applicationId}`,
    auth: authToken
  })
  await checkTransitionStatus(applicationSummary, applicationId, authToken)
  const destinationCode = applicationSummary.availableTransitions.find(transition => transition.toNode === destination)

  if (destinationCode) {
    await asyncRetry({
      method: PATCH,
      url: `${serverConfig.apiEndpoint}/applications/transition/${applicationId}/${destinationCode.id}`,
      auth: authToken
    })
  }
  console.log(`Application is in state ${applicationSummary.status.processStatus}`)
  console.log(`No destinationCode found. Transition is unavailable, application not moved to state ${destination}`)
}

module.exports = { transitionApplication }
