const routes = [].concat(
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/static'),
  require('../routes/'),
  require('../routes/sign-in-oidc'),
  require('../routes/sign-in'),
  require('../routes/sign-out'),
  require('../routes/check-eligibility'),
  require('../routes/confirmation'),
  require('../routes/eligible-organisations')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
