const { GET } = require('../constants/http-verbs')

module.exports = [{
  method: GET,
  path: '/assets/{path*}',
  options: {
    auth: false,
    handler: {
      directory: {
        path: [
          'node_modules/govuk-frontend/govuk/assets'
        ]
      }
    },
    cache: {
      expiresIn: 10000,
      privacy: 'private'
    }
  }
}, {
  method: GET,
  path: '/govuk-frontend/govuk/{path*}',
  options: {
    auth: false,
    handler: {
      directory: {
        path: [
          'node_modules/govuk-frontend/govuk'
        ]
      }
    },
    cache: {
      expiresIn: 10000,
      privacy: 'private'
    }
  }
}, {
  method: GET,
  path: '/static/{path*}',
  options: {
    auth: false,
    handler: {
      directory: {
        path: [
          'app/dist',
          'node_modules/govuk-frontend/govuk/assets'
        ]
      }
    },
    cache: {
      expiresIn: 10000,
      privacy: 'private'
    }
  }
}]
