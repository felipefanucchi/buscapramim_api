const express = require('express');
const router = express.Router();
// Controllers
const RegisterController = require('./controllers/RegisterController');
const LoginController = require('./controllers/LoginController');
const ProfileController = require('./controllers/ProfileController');
const ForgotPasswordController = require('./controllers/ForgotPasswordController');
const ResetPasswordController = require('./controllers/ResetPasswordController');
const ProductController = require('./controllers/ProductController');
const UserNeedController = require('./controllers/UserNeedController');
const AvailableUserController = require('./controllers/AvailableUserController');

// Middlewares
const verifyToken = require('./middlewares/verifyToken');

router.post('/register', RegisterController.create);
router.post('/login', LoginController.create);
router.post('/forgot_password', ForgotPasswordController.create);
router.put('/reset_password', ResetPasswordController.update);

router.get('/profile', verifyToken, ProfileController.index);
router.put('/profile', verifyToken, ProfileController.update);

router.post('/product', verifyToken, ProductController.create);
router.delete('/product/:product_id', verifyToken, ProductController.delete);
router.get('/product', verifyToken, ProductController.index);

router.get('/user_need', verifyToken, UserNeedController.index);
router.get('/available_user', verifyToken, AvailableUserController.index);

module.exports = router;
