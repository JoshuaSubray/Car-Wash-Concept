const express = require('express');
const router = express.Router();
const Review = require('../models/Reviews')

// In-memory storage for reviews (replace with a database in production).
// let reviews = [];

/* GET reviews page. */
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({date: -1})
    res.render('reviews', { reviews});
  } catch (err) {
    req.flash('error_msg', "Can't load reviews")
    res.redirect('/');
  }
  // res.render('reviews', { reviews: reviews });
});

router.post('/', async (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash('error_msg', "Can't have no anonymous reviews, log in please.");
    return res.redirect('/users/login');
  }

  const { name, email, review, rating } = req.body;

  // Validate inputs
  if (!name || !email || !review || !rating) {
    req.flash('error_msg', "Please fill out all fields, including the rating.");
    return res.redirect('/reviews');
  }

  if (isNaN(rating) || rating < 1 || rating > 5) {
    req.flash('error_msg', "Rating must be a number between 1 and 5.");
    return res.redirect('/reviews');
  }

  try {
    const newReview = new Review({ name, email, review, rating });
    await newReview.save();

    req.flash('success_msg', 'Your review has been submitted!');
    res.redirect('/reviews');
  } catch (err) {
    req.flash('error_msg', 'There was a problem submitting your review, retry.');
    res.redirect('/reviews');
  }
});


module.exports = router;


