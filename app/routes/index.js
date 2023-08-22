const { AUTH_COOKIE_NAME, AUTH_REFRESH_COOKIE_NAME } = require('../constants/cookies')
const { GET } = require('../constants/http-verbs')
const { authConfig } = require('../config')

module.exports = [{
  method: GET,
  path: '/',
  handler: (request, h) => {
    if (request.query.token) {
      console.log('Setting auth cookie')
      h.state(AUTH_COOKIE_NAME, request.query.token, authConfig.cookieOptions)
    }

    if (request.query.refreshToken) {
      console.log('Setting refresh cookie')
      h.state(AUTH_REFRESH_COOKIE_NAME, request.query.refreshToken, authConfig.cookieOptions)
    }
    return h.view('index')
  }
}]
