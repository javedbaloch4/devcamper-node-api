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
        type: Number,
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

CourseSchema.statics.getAverageCost = async function(bootcampId) {
    console.log('Calculating the average cost ....'.blue)

    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId }
        },
        {
            $group: {
                _id: '$bootcamp',
                averageCost: { $avg: '$tuition' }
            }
        }
    ])

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageCost: Math.ceil(obj[0].averageCost / 10) * 10
        })
    } catch(err) {
        console.error(err)
    }
}

// Call getAverageCost after sasve
CourseSchema.post('save', function() {
    this.constructor.getAverageCost(this.bootcamp)
})

// Call getAverageCost before remove
CourseSchema.post('remove', function() {
    this.constructor.getAverageCost(this.bootcamp)
})


export default mongoose.model('Course', CourseSchema);