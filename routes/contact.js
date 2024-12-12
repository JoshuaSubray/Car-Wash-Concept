const express = require('express');
const router = express.Router();

// Define your routes here
router.get('/', (req, res) => {
    res.send('Contact page');
});

// Handle form submission
router.post('/', (req, res) => {
    res.send('<script>alert("Form submitted successfully"); window.location.href="/";</script>');
});

module.exports = router;