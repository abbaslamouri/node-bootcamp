const mongoose = require('mongoose')

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'tour name is required'],
    unique: true,
    trim: true,
  },
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
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'Tour price is required'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    required: [true, 'Summary is required'],
    trim: true,
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
})

module.exports = mongoose.model('Tour', tourSchema)
