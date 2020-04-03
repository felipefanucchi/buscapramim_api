const db = require('../database/db');
const knexPostgis = require('knex-postgis');
const st = knexPostgis(db);
const knexnest = require('knexnest');

module.exports = {
  async index(request, response) {
    const { page = 1 } = request.query;

    try {
      const [count] = await db('products').count();

      const query = db
        .select(
          'u.id AS _id',
          'u.name AS _name',
          'u.address_complement AS _complement',
          st.x('coordinates').as('_longitude'),
          st.y('coordinates').as('_latitude'),
          'p.name AS _products__name',
          'p.description AS _products__description',
          'p.quantity AS _products__quantity'
        )
        .from('users AS u')
        .join('products AS p', 'u.id', '=' ,'p.user_id');

      let users = await knexnest(query)

      users = users.map(user => {
        user.coordinates = [ user.longitude, user.latitude ];

        delete user.longitude;
        delete user.latitude;  
        return user;
      });

      response.header('X-Total-Count', count['count']);

      return response.json({ users });
    } catch(err) {
      console.log(err);
      return response.status(400).send({error: 'Error while listing the products/users, try again later.'})
    } 
  }
}
