const express = require('express')
const { gettAllUsers, createUser, getUser, updateUser, deleteUser } = require("../controllers/userController")

const router = express.Router()

router.route('/').get(gettAllUsers).post(createUser)
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = router
