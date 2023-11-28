const { GET, PATCH } = require('../constants/http-verbs')
const { asyncRetry } = require('../processing/async-retry')
const { checkTransitionStatus } = require('./check-transition-status')

const transitionApplication = async (applicationId, destination, authToken) => {
  const applicationSummary = await asyncRetry({
    method: GET,
    url: `http://ffc-tcg-api-gateway:3004/applications/status/${applicationId}`,
    auth: authToken
  })
  await checkTransitionStatus(applicationSummary, applicationId, authToken)
  const destinationCode = applicationSummary.availableTransitions.find(transition => transition.toNode === destination)

  if (!destinationCode) {
    console.log(`No destinationCode found for: ${destinationCode}. Transition is unavailable, application not moved to state ${destination}`)
  }

  await asyncRetry({
    method: PATCH,
    url: `http://ffc-tcg-api-gateway:3004/applications/transition/${applicationId}/${destinationCode.id}`,
    auth: authToken
  })
}

module.exports = { transitionApplication }
