const User = require('../models/userModel.js')
const APIFeatures = require('../utils/APIFeatures')
const AppError = require('../utils/AppError')
catchAsync = require('../utils/catchAsync')

exports.getAllUsers = async (req, res) => {
  const features = new APIFeatures(User.find(), req.query).filter().sort().fields().paginate()
  const users = await features.query
  res.status(200).json({
    status: 'succes',
    results: users.length,
    data: { users },
  })
}

exports.getUser = async (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Not yet defined',
  })
}

exports.createUser = async (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Not yet defined',
  })
}

exports.updateUser = async (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Not yet defined',
  })
}

exports.deleteUser = async (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Not yet defined',
  })
}
