const Joi = require('joi')
const { DEVELOPMENT, TEST, PRODUCTION } = require('../constants/environments')

const schema = Joi.object().keys({
  port: Joi.number().default(3055),
  env: Joi.string().valid(DEVELOPMENT, TEST, PRODUCTION).default(DEVELOPMENT),
  serviceName: Joi.string().default('Apply for the Mini Scheme'),
  cookieOptions: Joi.object({
    ttl: Joi.number().default(1000 * 60 * 60 * 24), // 24 hours
    encoding: Joi.string().valid('base64json').default('base64json'),
    isSameSite: Joi.string().valid('Lax').default('Lax'),
    isSecure: Joi.bool().default(true),
    isHttpOnly: Joi.bool().default(true),
    clearInvalid: Joi.bool().default(false),
    strictHeader: Joi.bool().default(true)
  })
})

const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  serviceName: process.env.SERVICE_NAME,
  cookieOptions: {
    ttl: process.env.COOKIE_TTL,
    encoding: process.env.COOKIE_ENCODING,
    isSameSite: process.env.COOKIE_SAME_SITE,
    isSecure: process.env.NODE_ENV === PRODUCTION,
    isHttpOnly: process.env.COOKIE_HTTP_ONLY,
    clearInvalid: process.env.COOKIE_CLEAR_INVALID,
    strictHeader: process.env.COOKIE_STRICT_HEADER
  }
}

const { error, value } = schema.validate(config)

value.isDev = value.env === DEVELOPMENT

value.cookieOptionsIdentity = {
  ...value.cookieOptions,
  encoding: 'none'
}

if (error) {
  throw new Error(`The server config is invalid. ${error.message}`)
}

module.exports = value
