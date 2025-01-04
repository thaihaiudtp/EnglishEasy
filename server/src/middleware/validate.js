const { body } = require('express-validator');

const registerValidation = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .matches(/^[a-zA-Z\s]+$/).withMessage('Name must not contain special characters'),
    body('email')
        .isEmail().withMessage('Invalid email format'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/^[a-zA-Z0-9]+$/).withMessage('Password must not contain special characters'),
    body('class_user')
        .notEmpty().withMessage('Class is required')
        .isNumeric().withMessage('Class must be a number')
        .isLength({ max: 3 }).withMessage('Class must not exceed 3 digits'),
];
const loginValidation = [
    body('email')
        .isEmail().withMessage('Invalid email format'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/^[a-zA-Z0-9]+$/).withMessage('Password must not contain special characters'),
];
module.exports = {registerValidation, loginValidation};