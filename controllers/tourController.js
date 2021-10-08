// const fs = require('fs')
const APIFeatures = require('../utils/apiFeatures')
const Tour = require('../models/tourModel.js')

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

exports.gettAllTours = async (req, res) => {
  try {
    // if (req.query.page) {
    //   if (skip >= (await Tour.countDocuments())) throw new Error(`Page ${page} does not exists`)
    // }

    const features = new APIFeatures(Tour.find(), req.query).filter().sort().fields().paginate()

    const tours = await features.query
    res.status(200).json({
      status: 'succes',
      results: tours.length,
      data: { tours },
    })
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    })
  }
}

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
    res.status(200).json({
      status: 'succes',
      data: { tour },
    })
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    })
  }
}

exports.createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body)
    res.status(201).json({
      status: 'success',
      data: {
        tour: tour,
      },
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    })
  }
}

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    })
  }
}

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
      status: 'success',
      data: null,
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    })
  }
}
