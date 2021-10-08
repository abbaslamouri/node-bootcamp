const express = require('express')
const {
  gettAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  // checkId,
  // checkBody,
} = require('../controllers/tourController')

const router = express.Router()

// router.param('id', checkId)

router.route('/').get(gettAllTours).post(createTour)
router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour)

module.exports = router
