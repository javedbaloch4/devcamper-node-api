import mongoose from "mongoose";

const { Schema, model } = mongoose;

const CourseSchema = new Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add course title']
    },
    description: {
        type: String,
        required: [true, 'Please add description'],
    },
    weeks: {
        type: String,
        required: [true, 'Please add weeks']
    },
    tuition: {
        type: String,
        required: [true, 'Please add tuition cost']
    },
    minimumSkill: {
        type: String,
        required: [true, 'Please add a minimum skill'],
        enum: ['beginner', 'intermediate', 'advanced']
    },
    scholarShipAvaliable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
});

export default mongoose.model('Course', CourseSchema);