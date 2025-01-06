const express = require('express');
const router = express.Router();
const AuthController = require('../controller/authController');
const {registerValidation, loginValidation} = require('../middleware/validate');
router.post('/register', AuthController.Register);
router.post('/login', AuthController.Login);
module.exports = router;