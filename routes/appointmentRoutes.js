const express = require('express');
const router = express.Router();

const authUserController = require('../controllers/authUserController');
const appointmentController = require('../controllers/appointmentController');

router.route('/').post(authUserController.protect, appointmentController.bookAppointment);

router
   .route('/')
   .delete(
      authUserController.protect,
      authUserController.restrictTo('admin'),
      appointmentController.deleteAppo
   );

module.exports = router;
