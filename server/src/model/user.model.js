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
   tests: [{
        test: {
            type: Schema.Types.ObjectId,
            ref: 'Test',
        },
        total_questions: {
            type: Number, 
            default: 0,
        },
        correct_answers: {
            type: Number, // Số câu trả lời đúng
            default: 0,
        },
        start_time: {
            type: Date,
        },
        end_time: {
            type: Date,
        },        
        isBlock: {
            type: Boolean,
            default: false,
        },
        score: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ['in-progress', 'completed', 'abandoned'], 
            default: 'in-progress',
        },
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