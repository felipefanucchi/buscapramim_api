const db = require('../database/db');
const knexPostgis = require('knex-postgis');
const st = knexPostgis(db);
const bcrypt = require('bcryptjs');
const { registerValidation } = require('../validation');

module.exports = {
  async create(request, response) {
    const { error } = registerValidation(request.body);

    if (error) return response.status(400).json({error});

    const {
      name,
      email,
      phone,
      password,
      coordinates
    } = request.body;

    const [longitude, latitude] = coordinates;

    const emailExists = await db('users')
      .where('users.email', email)
      .select('*')
      .first();

    if (emailExists) response.status(400).json({error: 'E-mail already registered.'});

    const salt = await bcrypt.gentSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    try {
      const user = await db('users').insert({
        name,
        email,
        phone,
        password: hashPassword,
        coordinates: st.setSRID(st.geomFromText(`Point(${longitude} ${latitude})`), 4326)
      });

      // let users = await db('users').select([
      //   'users.name',
      //   'users.email',
      //   'users.phone',
      //   st.x('coordinates').as('longitude'),
      //   st.y('coordinates').as('latitude')
      // ]);

      // users = users.map(user => { 
      //   user.coordinates = [ user.longitude, user.latitude ];
      //   delete user.longitude;
      //   delete user.latitude;

      //   return user;
      // });

      return response.json({ user });
    } catch(err) {
      return response.status(400).send(err);
    }
  },
}
