const User = require('../models/userModel.js')
const APIFeatures = require('../utils/APIFeatures')
const AppError = require('../utils/AppError')
const catchAsync = require('../utils/catchAsync')

const filteredObj = (obj, allowedFields) => {
  const newObj = {}
  Object.keys(obj).forEach((prop) => {
    if (allowedFields.includes(prop)) newObj[prop] = obj[prop]
  })

  return newObj
}

const createSendData = async (user, statusCode, res) => {
  res.status(statusCode).json({
    status: 'success',
    data: {
      user,
    },
  })
}

exports.getAllUsers = async (req, res) => {
  const features = new APIFeatures(User.find(), req.query).filter().sort().fields().paginate()
  const users = await features.query
  res.status(200).json({
    status: 'succes',
    results: users.length,
    data: { users },
  })
}

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(new AppError('You cannot use this route for passsword updates', 400))
  const user = await User.findByIdAndUpdate(req.user.id, filteredObj(req.body, ['name', 'email']), {
    new: true,
    runValidators: true,
  })
  if (!user) return next(new AppError('You must be logged in to change your data', 401))

  createSendData(user, 200, res)
})

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false })

  createSendData(null, 204, res)
})

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
