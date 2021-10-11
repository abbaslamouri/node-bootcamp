const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const User = require('../models/userModel.js')
const AppError = require('../utils/AppError')
const catchAsync = require('../utils/catchAsync')
const sendEmail = require('../utils/mail')

const signToken = async (id) => {
  return promisify(jwt.sign)({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION })
}

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  })
  res.status(201).json({
    status: 'success',
    token: await signToken(user._id),
    data: {
      user,
    },
  })
})

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) return next(new AppError('Email and Password are required', 401))
  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.checkPassword(password, user.password)))
    return next(new AppError('Invalid email or password', 401))
  res.status(200).json({
    status: 'success',
    token: await signToken(user._id),
  })
})

exports.checkAuth = catchAsync(async (req, res, next) => {
  let token = ''
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    token = req.headers.authorization.split(' ')[1]

  if (!token) return next(new AppError('You are not allowed to access these resources, please login', 401))

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
  const user = await User.findById(decoded.id)
  if (!user) return next(new AppError('We cannot find a user with this token in our database', 401))

  if (await user.hasPasswordChanged(decoded.iat))
    return next(new AppError('User changed password recently, please login again', 401))

  req.user = user

  next()
})

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError('You do not have adequate permisson to perform this action', 403))
    next()
  }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body
  if (!email) return next(new AppError('Please enter a valid email', 404))

  const user = await User.findOne({ email })
  if (!user) return next(new AppError('We cannot find user with this email in our database', 404))

  const resetToken = await user.createPasswordResetToken()
  user.save({ validateBeforeSave: false })
})

exports.resetPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.checkPassword(password, user.password)))
    return next(new AppError('Invalid email or password', 401))
  res.status(200).json({
    status: 'success',
    token: await signToken(user._id),
  })
})
