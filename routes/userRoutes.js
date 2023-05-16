const express = require('express');
const router = express.Router();

const authUserController = require('../controllers/authUserController');

router.route('/signup').post(authUserController.signup);
router.route('/login').post(authUserController.login);
router.route('/logout').post(authUserController.logout);

module.exports = router;
