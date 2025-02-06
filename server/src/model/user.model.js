const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    password: {
        type: String,
        required: function() { return !this.googleId; },
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
        total_correct_answers: {
            type: Number, 
            default: 0,
        },
        answered_questions: [{
            question: {
                type: Schema.Types.ObjectId,
                ref: 'Question',
            },
            total: {
                type: Number,
                default: 0,
            }
        }],
        start_time: {
            type: Date,
        },
        end_time: {
            type: Date,
        },        
        score: {
            type: Number,
            default: 0,
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