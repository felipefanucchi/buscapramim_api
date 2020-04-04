const db = require('../database/db');
const knexPostgis = require('knex-postgis');
const st = knexPostgis(db);
const knexnest = require('knexnest');

module.exports = {
  async index(request, response) {
    const { page = 1 } = request.query;

    try {
      const query = db
        .select(
          'u.id AS _id',
          'u.name AS _name',
          'u.address_complement AS _addressComplement',
          st.x('coordinates').as('_longitude'),
          st.y('coordinates').as('_latitude'),
          'p.name AS _products__name',
          'p.description AS _products__description',
          'p.quantity AS _products__quantity'
        )
        .from(builder => {
          builder.select('*').from('users').offset((page - 1) * 10).limit(10).as('u')
        })
        .join(
          builder => {
            builder.select('*').from('products').as('p');
          },
          function() {
            this.on('p.user_id', '=', 'u.id')
          }
        );
      
      let users = await knexnest(query);

      users = users.map(user => {
        user.coordinates = [ user.longitude, user.latitude ];

        delete user.longitude;
        delete user.latitude;  
        return user;
      });

      return response.json({ users });
    } catch(err) {
      console.log(err);
      return response.status(400).send({error: 'Error while listing the products/users, try again later.'})
    } 
  }
}
