const express = require('express');
const router = express.Router();
const UserController = require('../controller/student');
const {verifyToken} = require('../middleware/verifyToken');

router.get('/all-class', UserController.ShowClass);
module.exports = router;