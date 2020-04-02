const express = require('express');
const router = express.Router();
// Controllers
const RegisterController = require('./controllers/RegisterController');
const LoginController = require('./controllers/LoginController');
const ProfileController = require('./controllers/ProfileController');
const ForgotPasswordController = require('./controllers/ForgotPasswordController');
const ResetPasswordController = require('./controllers/ResetPasswordController');
// Middlewares
const verifyToken = require('./middlewares/verifyToken');
//POST
router.post('/register', RegisterController.create);
router.post('/login', LoginController.create);
router.post('/forgot_password', ForgotPasswordController.create);
router.post('/reset_password', ResetPasswordController.create);
//GET
router.get('/profile', verifyToken, ProfileController.index);

module.exports = router;
