const db = require('../database/db');
const knexPostgis = require('knex-postgis');
const st = knexPostgis(db);

// validation
const Joi = require('@hapi/joi');
const customJoi = Joi.extend(require('joi-phone-number'));

const schema = {
  name: Joi.string().min(6).required(),
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
  phone: customJoi.string().phoneNumber().validate('+32494567324'),
  coordinates: Joi.array().ordered(
    Joi.number().min(-90).max(90).required(),
    Joi.number().min(-180).max(180).required()
  ).description("Please use this format [ longitude, latitude ]"),
};

module.exports = {
  async create(request, response) {
    const {
      name,
      email,
      phone,
      password,
      coordinates
    } = request.body;

    const [longitude, latitude] = coordinates;

    try {
      await db('users').insert({
        name,
        email,
        phone,
        password,
        coordinates: st.setSRID(st.geomFromText(`Point(${longitude} ${latitude})`), 4326)
      });

      let users = await db('users').select([
        'users.name',
        'users.email',
        'users.phone',
        st.x('coordinates').as('longitude'),
        st.y('coordinates').as('latitude')
      ]);

      users = users.map(user => { 
        user.coordinates = [ user.longitude, user.latitude ];
        delete user.longitude;
        delete user.latitude;

        return user;
      });

      return response.json({users});
    } catch(err) {
      return response.status(400).send(err);
    }
  },
}
