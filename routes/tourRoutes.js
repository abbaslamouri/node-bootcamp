const express = require('express')
const {
  cheapest5Alias,
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
} = require('../controllers/tourController')
const { checkAuth, restrictTo } = require('../controllers/authController')

const reviewRouter = require('../routes/reviewRoutes')

const router = express.Router()

// router.route('/:tourId/reviews').post(checkAuth, restrictTo('user'), createReview)
router.use('/:tourId/reviews', reviewRouter)

router.route('/cheapest5').get(cheapest5Alias, getAllTours)
router.route('/tour-stats').get(getTourStats)
router.route('/monthly-plan/:year').get(checkAuth, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan)

router.route('/').get(getAllTours).post(checkAuth, restrictTo('admin', 'lead-guide'), createTour)
router
  .route('/:id')
  .get(getTour)
  .patch(checkAuth, restrictTo('admin', 'lead-guide'), updateTour)
  .delete(checkAuth, restrictTo('admin', 'lead-guide'), deleteTour)

module.exports = router
