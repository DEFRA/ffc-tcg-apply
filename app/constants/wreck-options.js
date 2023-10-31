const { AUTH_COOKIE_NAME } = require('./cookies')

const WRECK_OPTIONS = (payload) => {
  return {
    headers: {
      authorization: `Bearer ${AUTH_COOKIE_NAME}`
    },
    rejectUnauthorized: false,
    json: true,
    payload
  }
}

module.exports = { WRECK_OPTIONS }
