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
        'users.available',
        'users.first_login',
        'users.address_complement',
        st.x('coordinates').as('longitude'),
        st.y('coordinates').as('latitude')
      ]).first();
    
    user.coordinates = [ user.longitude, user.latitude ];
    delete user.longitude;
    delete user.latitude;

    return response.json({user});
  },
  async update(request, response) {
    const {_id: id} = request.user;

    const { 
      name,
      phone,
      available,
      address_complement,
      first_login
    } = request.body;

    try {
      await db('users')
        .where('users.id', id)
        .update({ name, phone, available, address_complement, first_login });

      return response.json({ message: 'Profile updated' });
    } catch(err) {
      console.log(err)
      return response.status(400).send({error: 'There was an error while updating your profile, please, try again later!'})
    }
  }
}
