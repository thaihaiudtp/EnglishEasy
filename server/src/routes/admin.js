const express = require('express');
const router = express.Router();
const AdminController = require('../controller/admin');
const {verifyTokenAdmin} = require('../middleware/verifyToken');

router.post('/create-class', verifyTokenAdmin, AdminController.CreateClass);
router.post('/create-test', verifyTokenAdmin, AdminController.CreateTest);
router.post(`/:test_slug/create-question`, verifyTokenAdmin, AdminController.CreateQuestion);
router.put(`/:test_slug/active-test`, verifyTokenAdmin, AdminController.UpdateTesr);
module.exports = router;