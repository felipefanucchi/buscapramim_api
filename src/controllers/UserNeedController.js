const db = require('../database/db');
const knexPostgis = require('knex-postgis');
const st = knexPostgis(db);
const knexnest = require('knexnest');

module.exports = {
  async index(request, response) {
    let {long: longitude, lat: latitude, radius } = request.query;
    const { _id: id} = request.user;

    radius = radius / 1.60934; // Kilometers To Miles

    try {
      const query = db
        .select(
          'u.id AS _id',
          'u.name AS _name',
          'u.phone AS _phone',
          'u.address_complement AS _addressComplement',
          st.x('coordinates').as('_longitude'), 
          st.y('coordinates').as('_latitude'),
          'p.name AS _products__name',
          'p.description AS _products__description',
          'p.quantity AS _products__quantity'
        )
        .where(st.dwithin('coordinates', st.geography(st.makePoint(longitude, latitude)), radius))
        .whereNot('u.id', id)
        .from('users AS u')
        .join('products AS p', 'u.id', '=' ,'p.user_id');

      let users = await knexnest(query);

      if (!users) return response.status(200).send({users: []})

      return response.json({ users });
    } catch(err) {
      console.log(err);
      return response.status(400).send({error: 'Error while listing the products/users, try again later.'})
    } 
  }
}
