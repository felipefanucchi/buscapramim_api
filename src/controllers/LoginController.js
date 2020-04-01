const db = require('../database/db');
const bcrypt = require('bcryptjs');
const { loginValidation } = require('../validation');

module.exports = {
  async create(request, response) {
    const { error } = loginValidation(request.body);

    if (error) return response.status(400).json({error});

    const {
      email,
      password
    } = request.body;

    const user = await db('users')
      .where('users.email', email)
      .select('*')
      .first();

    if (!user) response.status(400).json({error: 'Email is not found.'});

    const validPass = await bcrypt.compare(password, user.password);

    if (!validPass) return response.status(400).json({error: 'Password is wrong'});

    return response.json({user})
  }
}
