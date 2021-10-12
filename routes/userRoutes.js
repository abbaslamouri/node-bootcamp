const express = require('express')
const { getAllUsers, createUser, getUser, updateUser, deleteUser } = require('../controllers/userController')
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updateMyPassword,
  checkAuth,
} = require('../controllers/authController')

const router = express.Router()

router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/forgot-password').post(forgotPassword)
router.route('/reset-password/:token').patch(resetPassword)
router.route('/update-my-password').patch(checkAuth, updateMyPassword)

router.route('/').get(getAllUsers).post(createUser)
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = router
