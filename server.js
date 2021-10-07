const app = require("./app") 

const port = 3000
app.listen(port, 'localhost', () => {
  console.log(`server running on port ${port}...`)
})