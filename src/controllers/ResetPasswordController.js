const db = require('../database/db');
const bcrypt = require('bcryptjs');
const { resetPasswordValidation } = require('../validation');

module.exports = {
  async update(request, response) {
    const { error } = resetPasswordValidation(request.body);

    if (error) return response.status(400).send({error});

    const { email, password } = request.body;
    const token = request.headers['reset-token'];

    try {
      const user = await db('users')
        .where({ email })
        .select('password_reset_token', 'password_reset_expires')
        .first();

      if (!user) return response.status(400).send({error: 'This email does not exist in our database.' })

      if (token !== user.password_reset_token) return response.status(400).send({error: 'Invalid token' });

      const now = new Date();
      if (now > user.password_reset_expires) return response.status(400).send({error: 'Expired token, generate a new one' });

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      await db('users')
        .where({ email })
        .update({ password: hashPassword });

      return response.json({message: 'Password changed.'})
    } catch (err) {
      console.log(err);
      return response.status(400).send({ error: 'Cannot reset password, try again' });
    }
  }
}
