const db = require('../database/db');
const knexPostgis = require('knex-postgis');
const st = knexPostgis(db);

module.exports = {
  async index(request, response) {
    const {_id: id} = request.user;
  
    let user = await db('users')
      .where('users.id', id)
      .select([
        'users.name',
        'users.email',
        'users.phone',
        'users.password',
        st.x('coordinates').as('longitude'),
        st.y('coordinates').as('latitude')
      ]).first();
    
    user.coordinates = [ user.longitude, user.latitude ];
    delete user.longitude;
    delete user.latitude;

    return response.json({user});
  }
}
