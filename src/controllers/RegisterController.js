const db = require('../database/db');
const knexPostgis = require('knex-postgis');
const st = knexPostgis(db);

module.exports = {
  async create(request, response) {
    const {
      name,
      email,
      phone,
      password,
      latitude,
      longitude
    } = request.body;

    try {
      await db('users').insert({
        name,
        email,
        phone,
        password,
        coordinates: st.setSRID(st.geomFromText(`Point(${longitude} ${latitude})`), 4326)
      });

      const coordinates = await db('users').select('users.name', st.x('coordinates').as('longitude'), st.y('coordinates').as('latitude'));
      return response.json({coordinates});
    } catch(err) {
      return response.status(400).send(err);
    }
  },
}
