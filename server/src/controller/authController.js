const User = require('../model/user.model');
const {validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const {jwtDecode} = require('jwt-decode');
const {genAccessToken} = require('../util/genAccessToken');
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
        const {email, password} = req.body;
        try {
            const existEmail = await User.findOne({email: email});
            if(!existEmail){
                return res.status(404).json({
                    success: false,
                    message: 'Email not found',
                })
            }
            if(existEmail.role === 3){
                return res.status(401).json({
                    success: false,
                    message: 'You are not authorized to login',
                })
            }
            const isMatchUser = bcrypt.compareSync(password, existEmail.password);
            if(!isMatchUser){
                return res.status(401).json({
                    success: false,
                    message: 'Invalid password',
                })
            }
            const token = genAccessToken(existEmail.email, existEmail.name, existEmail.class_user, existEmail.role);
            //console.log(token)
            return res.status(200).json({
                success: true,
                message: 'Login successfully',
                token: token,
                role: existEmail.role,
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                message: error.message
            });
        }
    }
    async authGoogle(req, res){
        const token = req.cookies.accessToken;
        if(!token){
            return res.status(401).json({
                success: false,
                message: 'You are not authorized to access this route',
            })
        }
        return res.status(200).json({
            success: true,
            message: 'You are authorized to access this route',
            token: token,
            role: '0'
        })
    }
    logout(req, res){
        res.clearCookie("accessToken");
    
        return res.status(200).json({
            success: true,
            message: "Logged out",
        });
    }
}   

module.exports = new AuthController;

