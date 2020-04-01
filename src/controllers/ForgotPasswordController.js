const db = require('../database/db');
const crypto = require('crypto');
const mailer = require('../mailer');

module.exports = {
  async create(request, response) {
    const { email } = request.body;

    console.log(email);

    const user = db('users')
      .where('users.email', email)
      .select('*')
      .first(); 

    if (!user) return response.status(400).json({error: 'This email does not exist in our database.'});
  }
}
