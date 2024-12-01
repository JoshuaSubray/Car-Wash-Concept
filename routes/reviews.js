const express = require('express');
const router = express.Router();
const Review = require('../models/Reviews')

// In-memory storage for reviews (replace with a database in production).
let reviews = [];

/* GET reviews page. */
router.get('/', (req, res) => {
  res.render('reviews', { reviews: reviews });
});

// POST route to handle review submission.
router.post('/', (req, res) => {
  const { name, review } = req.body;

  // Save the review in memory (or replace this with a database logic).
  reviews.push({ name, review });

  // Redirect to the reviews page after submission.
  req.flash('success_msg', 'Your review has been submitted!');
  res.redirect('/reviews');
});

module.exports = router;


