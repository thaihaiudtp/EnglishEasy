const User = require('../model/user.model');
const {validationResult} = require('express-validator');
class AuthController{
    async Register(req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }
        const {name, email, password, class_user} = req.body;
        try {
            const existEmail = await User.findOne({email: email});
            if (existEmail) {
                return res.status(409).json({
                    success: false,
                    message: 'Email already exist',
                })
            }
            const newUser = await User.create({
                name, email, password, class_user
            });
            return res.status(201).json({
                success: newUser ? true : false,
                message: newUser ? "User created successfully" : "Failed to create user",
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: error.message
            });
        }
    }
    async Login(req, res){
        res.status(200).json({
            message: "hello"
        })
    }
}   

module.exports = new AuthController;

