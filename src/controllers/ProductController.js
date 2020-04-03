const db = require('../database/db');

module.exports = {
  async create(request, response) {
    const {_id: user_id} = request.user;

    const { name, description, quantity } = request.body;

    try {
      await db('products').insert({ name, description, quantity, user_id });

      return response.json({message: 'Product successfully registered'});
    } catch(err) {
    return response.status(400).send({error: 'Error while registering the product, try again later.'})
    }
  }
}
