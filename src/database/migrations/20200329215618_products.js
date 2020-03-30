
exports.up = function(knex) {
  return knex.schema.createTable('products', function(table) {
    table.increments();
    table.string('name').notNullable();
    table.text('description');
    table.integer('user_id').notNullable();
    table.foreign('user_id').references('id').inTable('users');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('products');
};
