import mongoose from "mongoose";
import slugify from "slugify";
import geocoder from "../utils/nodeGeoCoder.js";

const { Schema } = mongoose;

const BootcampSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    maxLength: [50, "Name can not be more then 50 chracters"],
  },
  slug: String,
  description: {
    type: String,
    required: true,
    maxLength: [500, "Description can not be more than 500 chracters"],
  },
  website: {
    type: String,
    match: [
      /(https?:\/\/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9])(:?\d*)\/?([a-z_\/0-9\-#.]*)\??([a-z_\/0-9\-#=&]*)/g,
      "Please add valid URL with HTTP or HTTPS",
    ],
  },
  phone: {
    type: String,
    maxLength: [20, "Phone number not be longer than 20 characters."],
  },
  email: {
    type: "String",
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please add a valid email",
    ],
  },
  address: {
    type: String,
    required: [true, "Please add an address"],
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ["Point"],
    },

    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  careers: {
    // Array of strings
    type: [String],
    required: true,
    enum: [
      "Web Development",
      "Mobile Development",
      "UI/UX",
      "Data Science",
      "Business",
      "Other",
    ],
  },
  averageRating: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [10, "Rating must can not more than 10"],
  },
  averageCost: Number,
  photo: {
    type: String,
    default: "placeholder.jpg",
  },
  housing: {
    type: Boolean,
    default: false,
  },
  jobAssistance: {
    type: Boolean,
    default: false,
  },
  jobGuarantee: {
    type: Boolean,
    default: false,
  },
  acceptGi: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

BootcampSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true, replacement: '-' })
  next()
})

BootcampSchema.pre('save', async function(next) {

  const loc = await geocoder.geocode(this.address)
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].country
  }

  // Do not save address in DB
  this.address = undefined

  next()
})

// Cascade delete courses
BootcampSchema.pre('remove', async function(next) {
  console.log(`Courses being removed from bootcamp ${this._id}`)
  await this.model('Course').deleteMany({ bootcamp: this._id })
  
  next()
})

// Reverse populate with virtuals
BootcampSchema.virtual('courses', {
  ref: 'Course',
  localField: '_id',
  foreignField: 'bootcamp',
  justOne: false
})

export default mongoose.model("Bootcamp", BootcampSchema);
/**
 * const Blog = mongoose.model('Blog', blogSchema);
 * Test for imports
 * export default Mongoose.models?.Post || Mongoose.model("Post", postSchema);
 */