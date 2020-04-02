const knexPostgis = require('knex-postgis');

exports.seed = function(knex) {
  // Deletes ALL existing entries
  const st = knexPostgis(knex);
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          id: 1,
          name: 'Administrador',
          email: 'admin@buscapramim.com.br',
          password: 'c5zLKJv2TNoL7AF9e7hk2IwM3vIy6HeN',
          password_reset_token: '',
          password_reset_expires: '',
          phone: '11000000000',
          coordinates: st.geomFromText('Point(0 0)', 4326),
        },
      ]);
    });
};
