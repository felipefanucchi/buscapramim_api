const express = require('express');
const router = express.Router();

// Controllers
router.get('/', (request, response) => {
  const {body} = request;
  return response.json({ body: body.teste });
});

module.exports = router;
