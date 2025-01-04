const express = require('express');
const router = express.Router();
const AuthController = require('../controller/authController');
const {registerValidation, loginValidation} = require('../middleware/validate');
router.post('/register', registerValidation, AuthController.Register);
router.post('/login', loginValidation, AuthController.Login);
module.exports = router;