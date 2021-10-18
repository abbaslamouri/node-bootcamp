// const fs = require('fs')
const Tour = require('../models/tourModel.js')
const catchAsync = require('../utils/catchAsync')
const factory = require('../controllers/handlerFactory')
const AppError = require('../utils/AppError')

exports.cheapest5Alias = async (req, res, next) => {
  req.query.sort = 'price'
  req.query.fields = 'name,price'
  req.query.limit = 5
  next()
}

exports.getAllTours = factory.getAll(Tour)
exports.getTour = factory.getOne(Tour, { path: 'reviews' })
exports.createTour = factory.createOne(Tour)
exports.updateTour = factory.updateOne(Tour)
exports.deleteTour = factory.deleteOne(Tour)

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        tourCount: { $sum: 1 },
        ratingsCount: { $sum: '$ratingsAverage' },
        averageRating: { $avg: '$ratingsAverage' },
        averagePrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { averagePrice: 1 },
    },
  ])
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  })
})

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        tourCount: { $sum: 1 },
        tours: { $push: '$name' },
        ratingsCount: { $sum: '$ratingsAverage' },
        averageRating: { $avg: '$ratingsAverage' },
        averagePrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { month: 1 },
    },
    {
      $limit: 6,
    },
  ])
  res.status(200).json({
    status: 'success',
    count: plan.length,
    data: {
      plan,
    },
  })
})

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlgt, unit } = req.params
  const [lat, lgt] = latlgt.split(',')

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1

  if (!lat || !lgt)
    return next(new AppError('Latitude and longitude are required.  Please provide comma separated values', 400))

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lgt, lat], radius] } },
  }).select('name startLocation')

  console.log(distance, lgt, lat, unit)

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  })
})

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlgt, unit } = req.params
  const [lat, lgt] = latlgt.split(',')

  if (!lat || !lgt)
    return next(new AppError('Latitude and longitude are required.  Please provide comma separated values', 400))

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lgt * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: unit === 'mi' ? 0.0006213 : 0.001,
      },
    },
    {
      $project: {
        name: 1,
        distance: 1,
      },
    },
  ])

  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  })
})
