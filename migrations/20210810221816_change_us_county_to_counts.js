exports.up = function (knex) {
  return knex.schema.renameTable('us_county', 'covid_stats');
};

exports.down = function (knex) {
  return knex.schema.renameTable('covid_stats', 'us_county');
};
