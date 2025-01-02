const mongoose = require('mongoose');
const { Schema } = mongoose;

const questionSchema = new Schema({
    question_name: {
        type: String,
        required: true
    },
    answer_a: {
        type: String,
        required: true,
        trim: true,
    },
    answer_b: {
        type: String,
        required: true,
        trim: true,
    },
    answer_c: {
        type: String,
        required: true,
        trim: true,
    },
    answer_d: {
        type: String,
        required: true,
        trim: true,
    },
    correct_answer: {
        type: String,
        required: true,
        enum: ['A', 'B', 'C', 'D'],
    }
}, {
    timestamps: true,
});
module.exports = mongoose.model('Question', questionSchema);