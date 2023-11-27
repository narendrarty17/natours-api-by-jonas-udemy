const express = require('express');
const multer = require('multer');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

// Route handlers
const router = express.Router();

// Routes
router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);

router.route('/forgotpassword').post(authController.forgotPassword);
router.route('/resetpassword/:token').patch(authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

router.route('/updatepassword').patch(
    authController.updatePassword
);

router.route('/me').get(
    userController.getMe,
    userController.getUser
);
router.route('/updateme').patch(
    userController.uploadUserPhoto,
    userController.resizeUserPhoto,
    userController.updateMe
);
router.route('/deleteme').delete(
    userController.deleteMe
);

// Restrict all these routes to admin only using this middleware
router.use(authController.restrictTo('admin'));

router.route('/')
    .get(userController.getAllUsers)
    .post(userController.createUser);

router.route('/:id')
    .get(userController.getUser)
    .delete(userController.deleteUser)
    .patch(userController.updateUser);

module.exports = router;