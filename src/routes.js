const express = require('express');
const router = express.Router();
// Controllers
const RegisterController = require('./controllers/RegisterController');
const LoginController = require('./controllers/LoginController');

router.post('/register', RegisterController.create);
router.post('/login', LoginController.create);

module.exports = router;
