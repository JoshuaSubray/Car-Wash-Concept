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

// POST route to handle review submission.
router.post('/', async (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash('error_msg', "Can't have no anonymous reviews, log in please.")
    return res.redirect('/users/login')
  }

  const { name, email, review } = req.body;
  // let errors = [];

  if(!name || !email || !review) {
    req.flash('error_msg', "you forgot either your name or review or email lol");
    return res.redirect('/reviews')
  }

  try {
    const newReview = new Review({name, email, review})
    await newReview.save();

  // Save the review in memory (or replace this with a database logic).
  // reviews.push({ name, review });

  // Redirect to the reviews page after submission.
  req.flash('success_msg', 'Your review has been submitted!');
  res.redirect('/reviews');
  } catch (err) {
    req.flash('error_msg', 'There was a problem submitting your review, retry.');
    res.redirect('/reviews');
  }
});

module.exports = router;


