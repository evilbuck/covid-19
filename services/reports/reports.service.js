const hooks = require('./reports.hooks');
const Reports = require('./reports.class');
const db = require('../../db');

module.exports = function (app) {
  app.use(
    '/reports',
    new Reports({
      Model: db,
      name: 'us_county',
    })
  );
  app.service('/reports').hooks(hooks);
};
