const express = require('express')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
var xss = require('xss-clean')
const morgan = require('morgan')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const AppError = require('./utils/AppError')
const errorHandler = require('./controllers/errorHandler')

const app = express()

app.use(helmet())

app.use(express.json({ limit: '10kb' }))

// Data sanitization against noSQL query injection
app.use(mongoSanitize())

// Data sanitization against xss
app.use(xss())

app.use(express.static(`${__dirname}/public`))
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  console.log(req.headers)
  next()
})

const limitter = rateLimit({
  windowMs: 60 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many attempts from this IP, please try again after an hour',
})
app.use('/api', limitter)

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
})

app.use(errorHandler)

module.exports = app
