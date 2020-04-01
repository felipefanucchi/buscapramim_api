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

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    try {
      await db('users').insert({
        name,
        email,
        phone,
        password: hashPassword,
        coordinates: st.setSRID(st.geomFromText(`Point(${longitude} ${latitude})`), 4326)
      });

      const { id } = await db('users')
        .where('users.email', email)
        .select('users.id')
        .first();

      return response.json({ user: id });
    } catch(err) {
      return response.status(400).send(err);
    }
  },
}
