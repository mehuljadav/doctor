const express = require('express');
const router = express.Router();

const authUserController = require('../controllers/authUserController');
const authDoctorController = require('../controllers/authDoctorController');
const doctorController = require('../controllers/doctorController');

router.route('/signup').post(authDoctorController.signup);
router.route('/login').post(authDoctorController.login);
router.route('/logout').post(authDoctorController.logout);
router
   .route('/request-to-approve')
   .get(
      authUserController.protect,
      authUserController.restrictTo('admin'),
      doctorController.getRequestToApprovedDoctors
   );
router
   .route('/request-to-approve/:id')
   .post(
      authUserController.protect,
      authUserController.restrictTo('admin'),
      doctorController.approveDoctor
   );

router.route('/').get(doctorController.getDoctors);

router
   .route('/updateMe')
   .patch(authDoctorController.protect, doctorController.updateDoctor);

// Admin EndPoints 1.Approve Doctor 2.

module.exports = router;
