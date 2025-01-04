const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const genAccessToken = (email, name, class_user, role) => {
    try {
        return jwt.sign({
            email: email,
            name: name,
            class_user: class_user,
            role: role
        },
        'ThaiHa',
        {
            expiresIn: '1d'
        }
        )
    } catch (error) {
        console.log(error.message);
        return null;
    }
}
module.exports = {genAccessToken}