const db = require('../database/db');
const knexPostgis = require('knex-postgis');
const st = knexPostgis(db);

module.exports = {
  async index(request, response) {
    let {long: longitude, lat: latitude } = request.query;
    const { page = 1 } = request.query;
    const { _id: id} = request.user;

    console.log(longitude, latitude);

    try {
      const [count] = await db('users as u').whereNot('u.id', id).where('u.available', true).count();

      const query = await db.raw(
        `SELECT 
          name,
          email,
          phone,
          address_complement,
          id,
          ${st.distance('coordinates', st.geography(st.makePoint(longitude, latitude))).as('distance_away')} 
        FROM users as u 
        WHERE u.available = true AND u.id <> ${id}
        ORDER BY distance_away
        LIMIT 10
        OFFSET ${(page - 1) * 10}`
      );
      
      let users = query.rows;

      users = users.map(user => {
        user.distance_away = user.distance_away * 1.60934 / 1000; // Miles To Kilometers
        user.distance_away = user.distance_away.toFixed(2)
        return user;
      });

      response.header('X-Total-Count', count['count']);

      return response.json({ users });
    } catch(err) {
      console.log(err);
      return response.status(400).send({ error: 'We couldn\'t bring your users, try again later.' })
    }
  }
}
