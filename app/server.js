require('./insights').setup()
const Hapi = require('@hapi/hapi')

const createServer = async () => {
  const server = Hapi.server({
    port: process.env.PORT
  })

  await server.register(require('@hapi/inert'))
  await server.register(require('./plugins/router'))
  await server.register(require('./plugins/views'))

  return server
}

module.exports = { createServer }
