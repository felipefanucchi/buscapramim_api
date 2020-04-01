const express = require('express');
const router = express.Router();
// Controllers
const RegisterController = require('./controllers/RegisterController');
const LoginController = require('./controllers/LoginController');
const ProfileController = require('./controllers/ProfileController');
// Middleware
const verifyToken = require('./middlewares/verifyToken');

router.post('/register', RegisterController.create);
router.post('/login', LoginController.create);
router.get('/profile', verifyToken, ProfileController.index);

module.exports = router;
