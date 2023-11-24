const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({
    mergeParams: true
});

// POST /tour/43sfs/reviews
// GET /tour/sfswer/reviews
// POST /reviews

router.use(authController.protect);

router.route('/')
    .get(authController.protect, reviewController.getAllReviews)
    .post(
        authController.restrictTo('user'),
        reviewController.setTourUserIds,
        reviewController.createReview
    );

router.route('/:id')
    .get(reviewController.getReview)
    .delete(
        authController.restrictTo('user', 'admin'),
        reviewController.deleteReview
    )
    .patch(reviewController.updateReview);

module.exports = router;