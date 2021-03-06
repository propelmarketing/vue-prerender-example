const path = require('path');
const axios = require('axios');
const PrerenderSPAPlugin = require('prerender-spa-plugin'); // eslint-disable-line import/no-extraneous-dependencies

module.exports = (api) => {
  api.registerCommand('build:prerender', async (args) => {
    const { data } = await axios.get('http://localhost:4201/companies');
    const { companies } = data;
    api.chainWebpack((config) => {
      config.plugin('prerender').use(PrerenderSPAPlugin, [{
        staticDir: path.join(__dirname, 'dist'),
        routes: ['/'].concat(companies.map(company => `/companies/${company}`))
      }]);
    });

    await api.service.run('build', args);
  });
};

module.exports.defaultModes = {
  'build:prerender': 'production'
};
