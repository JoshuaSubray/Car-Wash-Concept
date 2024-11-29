const express = require('express');
const router = express.Router();
const Review = require('./reviews'); // Assuming you're using a MongoDB model

// Route to delete a review by ID
router.post('/reviews/delete/:id', (req, res) => {
  const reviewId = req.params.id;

  // Remove the review by ID
  Review.findByIdAndDelete(reviewId, (err) => {
    if (err) {
      req.flash('error_msg', 'Error deleting review');
      return res.redirect('/reviews');
    }

    req.flash('success_msg', 'Review deleted successfully');
    res.redirect('/reviews');
  });
});

module.exports = router;
