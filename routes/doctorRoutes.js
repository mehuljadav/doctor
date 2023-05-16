const express = require('express');
const router = express.Router();

const authDoctorController = require('../controllers/authDoctorController');

router.route('/signup').post(authDoctorController.signup);
router.route('/login').post(authDoctorController.login);
router.route('/logout').post(authDoctorController.logout);
module.exports = router;
