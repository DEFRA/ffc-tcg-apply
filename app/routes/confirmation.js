const Joi = require('joi')
const { GET } = require('../constants/http-verbs')
const { USER } = require('../auth/scopes')

module.exports = {
  method: GET,
  path: '/confirmation',
  options: {
    auth: { strategy: 'jwt', scope: [USER] },
    validate: {
      query: {
        referenceNumber: Joi.string().required()
      },
      failAction: (request, h, error) => {
        return h.redirect('/')
      }
    }
  },
  handler: (request, h) => {
    return h.view('confirmation', request.query)
  }
}
