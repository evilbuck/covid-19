exports.up = function (knex) {
  return knex.schema.createTable('us_county', (t) => {
    t.increments('id').primary();
    t.date('date');
    t.string('county');
    t.string('state');
    t.integer('county_fips');
    t.integer('state_fips');
    t.integer('cases');
    t.integer('deaths');

    t.timestamps(null, true);

    t.index('date');
    t.index(['state', 'county']);
    t.index('deaths');
    t.index('cases');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('us_county');
};
