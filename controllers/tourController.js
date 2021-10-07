const fs = require('fs')

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
)

exports.checkId = (req, res, next, val) => {
  console.log("VAL", val)
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    })
  }
  next()
}

exports.gettAllTours = (req, res) => {
  res.status(200).json({
    status: 'succes',
    results: tours.length,
    data: { tours },
  })
}

exports.getTour = (req, res) => {
  const tour = tours.find((item) => item.id === req.params.id * 1)
  res.status(200).json({
    status: 'succes',
    data: { tour },
  })
}

exports.createTour = (req, res) => {
  const newTour = { id: tours[tours.length - 1].id + 1, ...req.body }
  tours.push(newTour)
  console.log(tours)
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) res.status(400).send(err)
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      })
    }
  )
}

exports.updateTour = (req, res) => {
  const tour = tours.find((item) => item.id === req.params.id * 1)
  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Updated tour here',
    },
  })
}

exports.deleteTour = (req, res) => {
  const tour = tours.find((item) => item.id === req.params.id * 1)
  res.status(204).json({
    status: 'success',
    data: null,
  })
}