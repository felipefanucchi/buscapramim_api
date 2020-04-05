const db = require('../database/db');
const bcrypt = require('bcryptjs');
const { resetPasswordValidation } = require('../validation');

/**
 * @route PUT /reset_password
 * @group User - Operações para usuários
 * @param {string} body.required - Dados do usuario para redefinir a senha. - Exemplo: { "email": "a@a.com.br", "password": "password", "reset_token": "fkZwAUKPS9sZaVX6IvDp6ikPa8eUqMxE"}
 * @type {{create(*, *): Promise<*|undefined>}}
 * @returns {object} 400 - O email nao foi encontrado no banco de dados.
 * @returns {object} 400 - Token invalido.
 * @returns {object} 400 - Token expirado.
 * @returns {object} 400 - Nao foi possivel redefinir a senha, tente novamente.
 * @returns {object} 200 - Sucesso.
 */
module.exports = {
  async update(request, response) {
    const { error } = resetPasswordValidation(request.body);

    if (error) return response.status(400).send({error: error.details[0].message});

    const { email, password, reset_token } = request.body;
    const token = reset_token;

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
      return response.status(400).send({ error: 'Cannot reset password, try again' });
    }
  }
}
