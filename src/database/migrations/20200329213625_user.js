
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.text('password').notNullable();
    table.string('password_reset_token');
    table.string('password_reset_expires');
    table.string('phone').notNullable();
    table.boolean('available').defaultTo(true);
    table.boolean('first_login').defaultTo(true);
    table.text('address_complement');
    table.specificType('coordinates', 'geometry(point, 4326)');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
