const mongoose = require('mongoose');
async function connectDB() {
    try {
        await mongoose.connect('mongodb://localhost:27017/CRUD_LEARN'/*'mongodb+srv://YtYZdePY:04PiKjNKlDio3JiN@us-east-1.ufsuw.mongodb.net/test-52Jo'*/)
        console.log("ok!")
    } catch (error) {
        console.log(error);
    }
}
module.exports = {connectDB}