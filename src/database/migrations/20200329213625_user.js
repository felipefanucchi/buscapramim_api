
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments();
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.text('password').notNullable();
    table.string('password_reset_token');
    table.string('password_reset_expires');
    table.string('phone').notNullable();
    table.specificType('coordinates', 'geometry(point, 4326)');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
