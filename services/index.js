const reportsService = require('./reports/reports.service');
module.exports = function (app) {
  app.configure(reportsService);
  app.configure(require('./dashboard/dashboard.service'));
  app.configure(require('./demographics/demographics.service'));
};
