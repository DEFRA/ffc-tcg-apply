const Joi = require('joi')
const PRODUCTION = 'production'

const schema = Joi.object({
  messageQueue: {
    host: Joi.string(),
    username: Joi.string(),
    password: Joi.string(),
    useCredentialChain: Joi.bool().default(false),
    appInsights: Joi.object()
  },
  eligibilityTopic: {
    address: Joi.string()
  },
  eligibilitySubscription: {
    address: Joi.string(),
    topic: Joi.string(),
    type: Joi.string().default('subscription')
  },
  eligibilityQueue: {
    address: Joi.string()
  }
})

const config = {
  messageQueue: {
    host: process.env.MESSAGE_QUEUE_HOST,
    username: process.env.MESSAGE_QUEUE_USER,
    password: process.env.MESSAGE_QUEUE_PASSWORD,
    useCredentialChain: process.env.NODE_ENV === PRODUCTION,
    appInsights: process.env.NODE_ENV === PRODUCTION ? require('applicationinsights') : undefined
  },
  eligibilityTopic: {
    address: process.env.ELIGIBILITY_TOPIC_ADDRESS
  },
  eligibilitySubscription: {
    address: process.env.ELIGIBILITY_SUBSCRIPTION_ADDRESS,
    topic: process.env.ELIGIBILITY_TOPIC_ADDRESS,
    type: 'subscription'
  },
  eligibilityQueue: {
    address: process.env.ELIGIBILITY_QUEUE_ADDRESS
  }
}

const result = schema.validate(config, {
  abortEarly: false
})

if (result.error) {
  throw new Error(`The message config is invalid. ${result.error.message}`)
}

const eligibilityTopic = { ...result.value.messageQueue, ...result.value.eligibilityTopic }
const eligibilitySubscription = { ...result.value.messageQueue, ...result.value.eligibilitySubscription }
const eligibilityQueue = { ...result.value.messageQueue, ...result.value.eligibilityQueue }

module.exports = {
  eligibilitySubscription,
  eligibilityQueue,
  eligibilityTopic
}
