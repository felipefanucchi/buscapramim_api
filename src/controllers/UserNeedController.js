const db = require('../database/db');
const knexPostgis = require('knex-postgis');
const st = knexPostgis(db);

module.exports = {
  async index(request, response) {
    const { page = 1 } = request.query;

    try {
      const [count] = await db('products').count();

      let users = await db('users')
        .limit(10)
        .offset((page - 1) * 10)
        .select([
          'users.id',
          'users.name',
          'users.address_complement',
          st.x('coordinates').as('longitude'),
          st.y('coordinates').as('latitude'),
        ]);

      const products = await db('products')
        .limit(10)
        .offset((page - 1) * 10)
        .select([
          'products.user_id',
          'products.name',
          'products.description',
        ]);

      users = users.map(user => {
        user.coordinates = [ user.longitude, user.latitude ];

        delete user.longitude;
        delete user.latitude;  
        return user;
      });

      users.forEach(user => user.products = []);

      products.forEach(product => {
        users.forEach(user => {
          if (product.user_id === user.id) {
           user.products.push(product);
          }
        });
      });

      response.header('X-Total-Count', count['count']);

      return response.json({ users });
    } catch(err) {
      return response.status(400).send({error: 'Error while listing the products/users, try again later.'})
    } 
  }
}
