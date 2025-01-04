const mongoose = require('mongoose');
const { Schema } = mongoose;
const slugify = require('slugify');
const classSchema = new Schema({
    class_name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        slug: "class_name",
        unique: true,
    },
    student: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    tests: [{
        type: Schema.Types.ObjectId,
        ref: 'Test',
    }],
}, {
    timestamps: true
});
classSchema.pre('save', async function (next) {
    if(!this.slug){
        let slug = slugify(this.class_name, {lower: true, strict: true})
        let count = 1
        const originSlug = slug
        const Class = this.constructor

        while (await Class.countDocuments({ slug }) > 0) {
            slug = `${originSlug}-${count}`;
            count++;
        }

        this.slug = slug;
    }
    next();
})
module.exports = mongoose.model('Class', classSchema)