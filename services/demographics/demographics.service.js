const createService = require('feathers-objection');
const Demographic = require('../../models/demographic');

module.exports = function (app) {
  app.use(
    'demographics',
    createService({
      model: Demographic,
      whitelist: ['$eager', '$joinRelation', '$modify'],
    })
  );
};
