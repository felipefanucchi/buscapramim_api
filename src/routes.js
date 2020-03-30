const express = require('express');
const router = express.Router();
const db = require('./database/db');

// Controllers
router.get('/', async (request, response) => {
  const {name, description} = request.body;
  const {user_id} = request.headers;

  const user = {
    name,
    description,
    user_id: parseInt(user_id)
  };

  return response.json({ user });
});

module.exports = router;
