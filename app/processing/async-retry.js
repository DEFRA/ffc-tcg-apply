const Wreck = require('@hapi/wreck')
const { WRECK_OPTIONS } = require('../constants/wreck-options')

const asyncRetry = async (options, maxRetries = 5, delay = 5000) => {
  let retries = 0

  while (retries < maxRetries) {
    try {
      const response = await Wreck.request(options.method, options.url, WRECK_OPTIONS(options.payload))
      const payload = await Wreck.read(response, { json: true })

      if (response.statusCode >= 200 && response.statusCode < 300) {
        return payload
      } else {
        throw new Error(`Request failed with status code ${response.statusCode}`)
      }
    } catch (error) {
      console.error(`Error: ${error.message}`)

      // Retry after a delay
      await new Promise(resolve => setTimeout(resolve, delay))

      retries++
    }
  }

  throw new Error('Max retries reached')
}

module.exports = { asyncRetry }
