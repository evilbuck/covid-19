exports.up = function (knex) {
  return knex.schema.table('covid_stats', (t) => {
    t.integer('population');
    t.index('population');
    t.index('county_fips');
  });
};

exports.down = function (knex) {
  return knex.schema.table('covid_stats', (t) => {
    t.dropColumn('population');
  });
};
