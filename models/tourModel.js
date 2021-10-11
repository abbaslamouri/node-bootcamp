const mongoose = require('mongoose')
const slugify = require('slugify')
const validator = require('validator')

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'tour name is required'],
      unique: true,
      trim: true,
      minLength: [10, 'Name nust contain 10 characters min'],
      maxLength: [40, 'Name must conatin no more than 40 characters max'],
      // validate: {
      //   validator: validator.isAlphanumeric,
      //   message: 'Alpha numeric only',
      // },
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Maximum group size is required'],
    },
    difficulty: {
      type: String,
      required: [true, 'Tour difficulty is a required field'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: ' Difficulty must be either easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [0, 'Ratings must be >=  0'],
      max: [5, 'Ratings must be <= to 5'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'Tour price is required'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // only works with create new document
          return val <= this.price
        },
        message: `Discount ({VALUE}) cannot be greater than price`,
      },
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'Cover image is required'],
    },
    images: [String],
    createdDate: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7
})

// Document Middleware, runs before save() and create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

// Query Middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } })
  next()
})

// Aggregation Middleware
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
  next()
})

module.exports = mongoose.model('Tour', tourSchema)
