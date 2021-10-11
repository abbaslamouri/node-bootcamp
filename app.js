const express = require('express')
const morgan = require('morgan')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')
const AppError = require('./utils/AppError')
const errorHandler = require('./controllers/errorHandler')

const app = express()

app.use(express.json())
app.use(express.static(`${__dirname}/public`))
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  console.log(req.headers)
  next()
})

app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
})

app.use(errorHandler)

module.exports = app
