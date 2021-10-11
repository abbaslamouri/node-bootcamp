const mongoose = require('mongoose')
const dotenv = require('dotenv')

process.on('uncaughtException', (err) => {
  console.log(err)
  console.log('ERROR', err.name, err.message)
  console.log('UNCAUGHT EXCEPTION, Server shutting down')
  process.exit(1)
})

dotenv.config({ path: './config.env' })

const app = require('./app')

const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

// console.log(db)

// console.log(process.env)

mongoose
  .connect(db, {
    // useNewURLParser: true,
    // autoIndex: true,
    // useFindAndModify: false,
  })
  .then((connection) => {
    // console.log(connection.connections)
    console.log(`DB connection successful...`)
  })

const port = process.env.PORT || 5000
server = app.listen(port, 'localhost', () => {
  console.log(`server running on port ${port}...`)
})

process.on('unhandledRejection', (err, promise) => {
  console.log('ERROR', err.name, err.message)
  console.log('UNHANDLED REJECTION, Server shutting down')
  server.close(() => {
    process.exit(1)
  })
})
