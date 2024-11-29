const express = require('express');
const router = express.Router();

// In-memory storage for reviews (replace with a database in production).
let reviews = [];

/* GET reviews page */
router.get('/', (req, res) => {
  res.render('reviews', { reviews });
});

// POST route to handle review submission
router.post('/', (req, res) => {
  const { name, review } = req.body;

  // Create a review object with a unique ID
  const newReview = {
    _id: new Date().toISOString(), // Use a timestamp for simplicity
    name,
    review
  };

  // Save the review in memory
  reviews.push(newReview);

  // Redirect to the reviews page after submission
  req.flash('success_msg', 'Your review has been submitted!');
  res.redirect('/reviews');
});

// POST route to handle review deletion
router.post('/delete/:id', (req, res) => {
  const reviewId = req.params.id;

  // Find and remove the review from the in-memory array
  reviews = reviews.filter(review => review._id !== reviewId);

  // Redirect back to reviews page with success message
  req.flash('success_msg', 'Review deleted successfully');
  res.redirect('/reviews');
});

module.exports = router;
