const express = require('express');
const router = express.Router();

const authDoctorController = require('../controllers/authDoctorController');
const doctorController = require('../controllers/doctorController');
router.route('/signup').post(authDoctorController.signup);
router.route('/login').post(authDoctorController.login);
router.route('/logout').post(authDoctorController.logout);

router.route('/').get(doctorController.getDoctors);

module.exports = router;
