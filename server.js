const dotenv = require('dotenv')
dotenv.config({ path: './config.env' })

const app = require('./app')

// console.log(process.env)

const port = process.env.PORT || 3000
app.listen(port, 'localhost', () => {
  console.log(`server running on port ${port}...`)
})
