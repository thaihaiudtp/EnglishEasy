const mongoose = require('mongoose');
async function connectDB() {
    try {
        await mongoose.connect('mongodb+srv://ctb02thaiha:09022004@cluster0.tgl4y.mongodb.net/EnglishEasy?retryWrites=true&w=majority&appName=Cluster0')
        console.log("ok!")
    } catch (error) {
        console.log(error);
    }
}
module.exports = {connectDB}