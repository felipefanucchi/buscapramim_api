const db = require('../database/db');
const crypto = require('crypto');
const mailer = require('../modules/mailer');
const { forgotPasswordValidation } = require('../validation');

module.exports = {
  async create(request, response) {
    const { error } = forgotPasswordValidation(request.body);

    if (error) return response.status(400).send({error: error.details[0].message});

    const { email } = request.body;

    try {
      const user = await db('users')
        .where('users.email', email)
        .select('*')
        .first(); 

      if (!user) return response.status(400).send({error: 'This email does not exist in our database.'});

      const token = crypto.randomBytes(20).toString('HEX');

      const now = new Date();
      now.setHours(now.getHours() + 1);

      await db('users')
        .where('users.email', email)
        .update({
          password_reset_token: token,
          password_reset_expires: now,
        });

      await mailer.sendMail({
        to: email,
        from: 'flfanucchi@gmail.com',
        template: '../mail/forgot-password',
        context: { token },
      }, err => {
        if (err) {
          return response.status(400).send({ error: 'Error on sending the forgot password email, please try again later.' })
        }

        return response.status(204).send();
      });
    } catch(err) {
      return response.json({error: 'Error on forgot password, try again!'});
    }
  }
}
