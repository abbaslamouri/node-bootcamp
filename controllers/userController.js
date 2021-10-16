const User = require('../models/userModel.js')
const APIFeatures = require('../utils/APIFeatures')
const AppError = require('../utils/AppError')
const catchAsync = require('../utils/catchAsync')
const factory = require('../controllers/handlerFactory')

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

exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id
  next()
})


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

exports.createUser = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined.  Please use /signup instead',
  })
})

exports.getAllUsers = factory.getAll(User)
exports.getUser = factory.getOne(User)
exports.updateUser = factory.updateOne(User)
exports.deleteUser = factory.deleteOne(User)
