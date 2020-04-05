const db = require('../database/db');
const knexPostgis = require('knex-postgis');
const st = knexPostgis(db);
const knexnest = require('knexnest');

module.exports = {
  async index(request, response) {
    let {long: longitude, lat: latitude, radius } = request.query;

    try {
      const query = db
        .select(
          'u.id AS _id',
          'u.name AS _name',
          'u.address_complement AS _addressComplement',
          st.distance('coordinates', st.geography(st.makePoint(longitude, latitude))).as('_distanceAway'),
          'p.name AS _products__name',
          'p.description AS _products__description',
          'p.quantity AS _products__quantity'
        )
        .where(st.dwithin('coordinates', st.geography(st.makePoint(longitude, latitude)), radius))
        .from('users AS u')
        .join('products AS p', 'u.id', '=' ,'p.user_id');

      let users = await knexnest(query);


      return response.json({ users });
    } catch(err) {
      console.log(err);
      return response.status(400).send({error: 'Error while listing the products/users, try again later.'})
    } 
  }
}
