
const express = require('express');
const router = express.Router();

// Define your routes here
router.get('/contact', (req, res) => {
    res.send('Contact page');
});

module.exports = router;