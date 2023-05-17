const express = require('express');
const router = express.Router();

const authUserController = require('../controllers/authUserController');
const appointmentController = require('../controllers/appointmentController');

router
   .route('/')
   .get(appointmentController.getAppointments)
   .post(authUserController.protect, appointmentController.bookAppointment);

router
   .route('/:id')
   .get(appointmentController.getAppointment)
   .delete(
      authUserController.protect,
      authUserController.restrictTo('admin'),
      appointmentController.deleteAppointment
   )
   .patch(authUserController.protect, appointmentController.updateAppointment);

router
   .route('/cancel-appointment/:id')
   .post(authUserController.protect, appointmentController.cancelAppointment);

module.exports = router;
