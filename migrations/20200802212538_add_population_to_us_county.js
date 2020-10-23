exports.up = function (knex) {
  return knex.schema.createTable('counties', (t) => {
    t.increments('id');
    t.string('county');
    t.integer('population');
    t.string('state');
    t.unique(['county', 'state']);

    t.timestamps(null, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('counties');
};
