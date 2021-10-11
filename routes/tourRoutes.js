const express = require('express')
const {
  cheapest5Alias,
  gettAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tourController')
const { checkAuth, restrictTo } = require('../controllers/authController')

const router = express.Router()

router.route('/cheapest5').get(cheapest5Alias, gettAllTours)
router.route('/tour-stats').get(getTourStats)
router.route('/monthly-plan/:year').get(getMonthlyPlan)

router.route('/').get(checkAuth, gettAllTours).post(createTour)
router.route('/:id').get(getTour).patch(updateTour).delete(checkAuth, restrictTo('user', 'lead-guide'), deleteTour)

module.exports = router
