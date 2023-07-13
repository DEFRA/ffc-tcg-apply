const routes = [].concat(
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/static'),
  require('../routes/confirmation'),
  require('../routes/')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
