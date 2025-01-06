const express = require('express');
const router = express.Router();
const UserController = require('../controller/student');
const {verifyToken} = require('../middleware/verifyToken');

router.get('/all-class', UserController.ShowClass);
router.get('/:slug', verifyToken, UserController.showOneClass);
router.post('/:test_id', verifyToken, UserController.doTest);
router.post('/:testId/submit', verifyToken, UserController.submitQuestion);
module.exports = router;