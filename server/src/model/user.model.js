const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    class_user: {
        type: String,
        required: true,
    },
    role: {
        type: Number,
        default: 0,
    },
    point: [{
        test: {
            type: Schema.Types.ObjectId,
            ref: 'Test',
        },
        score: {
            type: Number,
            default: 0,
        }
    }],
}, {
    timestamps: true,
});
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        return next();
    }
    const saltRound = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, saltRound);
    next();
})
module.exports = mongoose.model('User', userSchema);