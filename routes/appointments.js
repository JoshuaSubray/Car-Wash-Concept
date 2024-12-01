const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

const packagePrices = {
    Basic: '19.99',
    Business: '29.99',
    Premium: '39.99',
    Deluxe: '99.99',
    VIP: '199.99',
    Royal: '299.99',
}

/* GET appointments page. */
router.get('/', function (req, res, next) {
    if (!req.isAuthenticated()) { // must be logged in to make an appointment.
        req.flash('error_msg', 'Please log in to book an appointment.');
        return res.redirect('/users/login');
    }

    // get username and email from logged-in account to automatically fill-in form.
    const username = req.user.username;
    const email = req.user.email;

    // Get the package from query parameters
    const selectedPackage = req.query.package || ''; // Default to empty string if not provided

    res.render('appointments', { 
        title: 'Appointments', 
        username, 
        email, 
        selectedPackage 
    });
})

// appointments page validation.
router.post('/', async (req, res) => {
    const { name, email, date, message, package } = req.body;
    let errors = [];

    if (!name || !email || !date || !package) {
        errors.push({ msg: 'Please enter all required fields' });
    }

    if (errors.length > 0) {
        res.render('appointments', {
            errors,
            name,
            email,
            date,
            message,
            package,
        });
    }

    const price = packagePrices[package];
    req.session.appointmentData = { name, email, date, message, package, price };
    res.redirect('/payment');
});

module.exports = router;
