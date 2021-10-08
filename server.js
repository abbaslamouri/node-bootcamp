const mongoose = require('mongoose')
const dotenv = require('dotenv')

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
    console.log(`DB connection on port successful...`)
  })

// const testTour = new Tour({
//   name: 'The Forest Hiker',
//   rating: 4.7,
//   price: 497,
// })

// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc)
//   })
//   .catch((error) => {
//     console.log('ERROR:', error)
//   })

const port = process.env.PORT || 3000
app.listen(port, 'localhost', () => {
  console.log(`server running on port ${port}...`)
})
