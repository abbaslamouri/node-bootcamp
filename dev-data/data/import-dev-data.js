const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Tour = require('../../models/tourModel')

dotenv.config({ path: './config.env' })

// const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD), {}).then((connection) => {
  console.log(`DB connection successful...`)
})

// Read data from file
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'))

// Import data into db
const importData = async () => {
  try {
    await Tour.create(tours)
    console.log('Data uploaded to database successfully...')
  } catch (error) {
    console.log(error)
  }
  process.exit()
}

// Delete all data from db
const deleteData = async () => {
  try {
    await Tour.deleteMany()
    console.log('Data delete from database successfully...')
  } catch (error) {
    console.log(error)
  }
  process.exit()
}

if (process.argv[2] === '--import') {
  importData()
} else if (process.argv[2] === '--delete') {
  deleteData()
}

// console.log(process.argv)
