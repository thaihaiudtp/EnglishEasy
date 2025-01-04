const mongoose = require('mongoose');
const { Schema } = mongoose;
const slugify = require('slugify');
const testSchema = new Schema({
    name_test: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        slug: "name_test",
        unique: true,
    },
    description_test: {
        type: String,
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
    total_questions: {
        type: Number, // Tổng số câu hỏi
        required: true,
        default: 0, // Mặc định là 0
    },
    duration: {
        type: Number, 
        required: true,
    },
    createBy: {
        type: String,
    },
    question_test: [{
        question: {
            type: Schema.Types.ObjectId,
            ref: 'Question',
        },
    }],
}, {
    timestamps: true,
});
testSchema.pre('save', async function (next) {
    if(!this.slug){
        let slug = slugify(this.name_test, {lower: true, strict: true})
        let count = 1
        const originSlug = slug
        const Test = this.constructor

        while (await Test.countDocuments({ slug }) > 0) {
            slug = `${originSlug}-${count}`;
            count++;
        }

        this.slug = slug;
    }
    next();
})
module.exports = mongoose.model('Test', testSchema);