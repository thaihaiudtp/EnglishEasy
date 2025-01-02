const mongoose = require('mongoose');
const { Schema } = mongoose;

const testSchema = new Schema({
    name_test: {
        type: String,
        required: true,
    },
    class_test: {
        type: Number,
        required: true,
    },
    diffcult_test: {
        type: String,
        required: true,
    },
    status_test:{
        type: Number,
        required: true,
        default: 0,
    },
    question_test: [{
        question: {
            type: Schema.Types.ObjectId,
            ref: 'Question',
        },
        score: {
            type: Number,
            default: 0,
        }
    }],
}, {
    timestamps: true,
});
module.exports = mongoose.model('Test', testSchema);