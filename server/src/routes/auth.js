const express = require('express');
const router = express.Router();
const AuthController = require('../controller/authController');
const {registerValidation} = require('../middleware/validate');
router.post('/register', registerValidation, AuthController.Register);

module.exports = router;