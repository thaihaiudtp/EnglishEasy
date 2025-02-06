const express = require('express');
const router = express.Router();
const AdminController = require('../controller/admin');
const UserController = require('../controller/student');
const {verifyTokenAdmin} = require('../middleware/verifyToken');
router.get('/showOneTest/:testId', verifyTokenAdmin, AdminController.showOneTest);
router.get('/show-users', verifyTokenAdmin, AdminController.showAllUser);
router.get('/show-tests', verifyTokenAdmin, AdminController.showAllTest);
router.post('/create-class', verifyTokenAdmin, AdminController.CreateClass);
router.post('/create-test', verifyTokenAdmin, AdminController.CreateTest);
router.post(`/:testId/create-question`, verifyTokenAdmin, AdminController.CreateQuestion);
router.post(`/:testId/add-test`, verifyTokenAdmin, AdminController.AddTestToClass);
router.post(`/add-test-student`, verifyTokenAdmin, AdminController.addTestToUser);
router.put(`/:testId/active-test`, verifyTokenAdmin, AdminController.UpdateTesr);
router.get('/all-class/:testId', verifyTokenAdmin, AdminController.ShowClass);
module.exports = router;