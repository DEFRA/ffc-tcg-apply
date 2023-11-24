const { GET, PATCH } = require('../constants/http-verbs')
const { asyncRetry } = require('../processing/async-retry')
const { checkTransitionStatus } = require('./check-transition-status')

const transitionApplication = async (applicationId, destination) => {
  const applicationSummary = await asyncRetry({ method: GET, url: `http://ffc-tcg-api-gateway:3004/applications/status/${applicationId}` })
  await checkTransitionStatus(applicationSummary, applicationId)
  const destinationCode = applicationSummary.availableTransitions.find(transition => transition.toNode === destination)
  if (destinationCode) {
    await asyncRetry({ method: PATCH, url: `http://ffc-tcg-api-gateway:3004/applications/transition/${applicationId}/${destinationCode.id}` })
  }
}

module.exports = { transitionApplication }
