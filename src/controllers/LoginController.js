const db = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { loginValidation } = require('../validation');

module.exports = {
  async create(request, response) {
    const { error } = loginValidation(request.body);

    if (error) return response.status(400).send({error: error.details[0].message});

    const {
      email,
      password
    } = request.body;

    const user = await db('users')
      .where('users.email', email)
      .select('*')
      .first();

    if (!user) response.status(400).send({error: 'Email is not found.'});

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return response.status(400).send({error: 'Password is wrong'});

    const token = jwt.sign({_id: user.id}, process.env.TOKEN_SECRET);
    return response.header('Authorization', token).json({token});
  }
}
