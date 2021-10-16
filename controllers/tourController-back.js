// const fs = require('fs')
const Tour = require('../models/tourModel.js')
const APIFeatures = require('../utils/APIFeatures')
const AppError = require('../utils/AppError')
const catchAsync = require('../utils/catchAsync')
const factory = require('../controllers/handlerFactory')

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// )

// exports.checkId = (req, res, next, val) => {
//   console.log('VAL', val)
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     })
//   }
//   next()
// }

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'MIssing name or price',
//     })
//   }
//   next()
// }

exports.cheapest5Alias = async (req, res, next) => {
  req.query.sort = 'price'
  req.query.fields = 'name,price'
  req.query.limit = 5
  next()
}

exports.getAllTours = factory.getAll(Tour)

// exports.getAllTours = catchAsync(async (req, res, next) => {
//   // try {
//   const features = new APIFeatures(Tour.find(), req.query).filter().sort().fields().paginate()

//   const tours = await features.query
//   res.status(200).json({
//     status: 'succes',
//     results: tours.length,
//     data: { tours },
//   })
//   // } catch (error) {
//   //   res.status(404).json({
//   //     status: 'fail',
//   //     message: error,
//   //   })
//   // }
// })

exports.getTour = factory.getOne(Tour, { path: 'reviews' })

// exports.getTour = catchAsync(async (req, res, next) => {
//   // try {
//   const tour = await Tour.findById(req.params.id).populate('reviews')
//   if (!tour) return next(new AppError(`We can't find a tour with ID = ${req.params.id}`, 404))
//   res.status(200).json({
//     status: 'succes',
//     data: { tour },
//   })
//   // } catch (error) {
//   //   res.status(404).json({
//   //     status: 'fail',
//   //     message: error,
//   //   })
//   // }
// })

exports.createTour = factory.createOne(Tour)

// exports.createTour = catchAsync(async (req, res, next) => {
//   // try {
//   const tour = await Tour.create(req.body)
//   if (!tour) return next(new AppError(`We can't find a tour with ID = ${req.params.id}`, 404))
//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: tour,
//     },
//   })
//   // } catch (error) {
//   //   res.status(400).json({
//   //     status: 'fail',
//   //     message: error,
//   //   })
//   // }
// })

exports.updateTour = factory.updateOne(Tour)

// exports.updateTour = catchAsync(async (req, res, next) => {
//   // try {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   })
//   if (!tour) return next(new AppError(`We can't find a tour with ID = ${req.params.id}`, 404))
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   })
//   // } catch (error) {
//   //   res.status(400).json({
//   //     status: 'fail',
//   //     message: error,
//   //   })
//   // }
// })

exports.deleteTour = factory.deleteOne(Tour)

// exports.deleteTour = catchAsync(async (req, res, next) => {
//   // try {
//   const tour = await Tour.findByIdAndDelete(req.params.id)
//   if (!tour) return next(new AppError(`We can't find a tour with ID = ${req.params.id}`, 404))
//   res.status(204).json({
//     status: 'success',
//     data: null,
//   })
//   // } catch (error) {
//   //   res.status(400).json({
//   //     status: 'fail',
//   //     message: error,
//   //   })
//   // }
// })

exports.getTourStats = catchAsync(async (req, res, next) => {
  // try {
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
  // } catch (error) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: error,
  //   })
  // }
})

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  // try {
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
  // } catch (error) {
  //   res.status(400).json({
  //     status: 'fail',
  //     message: error,
  //   })
  // }
})
