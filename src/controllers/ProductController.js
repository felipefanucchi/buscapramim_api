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
  },
  async delete(request, response) {
    const { _id: id } = request.user;
    const { product_id } = request.params;

    try {
      const results = await db('products')
        .select('id')
        .where('id', product_id)
        .where('user_id', id);

      if (!results.length) return response.status(400).send({error: 'Product does not exist'})

      await db('products')
        .where('id', product_id)
        .where('user_id', id)
        .del();

      return response.status(204).send({ message: 'Product successfully deleted.' })
    } catch(err) {
      return response.status(400).send({ error: 'Problem while deleting your product, try again later.' })
    }
  },
  async index(request, response) {
    const { _id: id } = request.user;

    const products = await db('products')
      .select('*')
      .where('user_id', id);

    return response.json({ products });
  }
}
