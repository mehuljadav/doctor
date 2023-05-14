const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const appointmentController = require('../controllers/appointmentController');

router.route('/').post(authController.protect, appointmentController.bookAppo);

router
   .route('/')
   .delete(
      authController.protect,
      authController.restrictTo('admin'),
      appointmentController.deleteAppo
   );

module.exports = router;
