const db = require('../database/db');

module.exports = {
  async index(request, response) {
    const { page = 1 } = request.query;
    const { _id: id} = request.user;

    try {
      const [count] = await db('users as u').whereNot('u.id', id).where('u.available', true).count();

      const query = await db.raw(
        `SELECT * 
        FROM users as u 
        WHERE u.available = true AND u.id <> ${id}
        LIMIT 10
        OFFSET ${(page - 1) * 10}`
      );
      
      const users = query.rows;

      response.header('X-Total-Count', count['count']);

      return response.json({ users });
    } catch(err) {
      return response.status(400).send({ error: 'We couldn\'t bring your users, try again later.' })
    }
  }
}
