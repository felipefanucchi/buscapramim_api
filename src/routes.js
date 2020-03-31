const express = require('express');
const router = express.Router();
// Controllers
const RegisterController = require('./controllers/RegisterController');

router.post('/register', RegisterController.create);

module.exports = router;
