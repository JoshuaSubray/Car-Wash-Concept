const express = require('express');
const router = express.Router();

// Define your routes here
router.get('/', (req, res) => {
    res.send('Contact page');
});

// Handle form submission
router.post('/', (req, res) => {
    const { name, email, message } = req.body;
    // Process the form data (e.g., save to database, send email, etc.)
    res.send('Form submitted successfully');
});

module.exports = router;