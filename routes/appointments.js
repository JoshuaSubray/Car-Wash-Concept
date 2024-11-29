const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

/* GET appointments page. */
router.get('/', function (req, res, next) {
    if (!req.isAuthenticated()) { // must be logged in to make an appointment.
        req.flash('error_msg', 'Please log in to book an appointment.');
        return res.redirect('/users/login');
    }
    res.render('appointments', { title: 'Appointments' });
})

// appointments page validation.
router.post('/', async (req, res) => {
    const { name, email, date, message } = req.body;
    let errors = [];

    if (!name || !email || !date) {
        errors.push({ msg: 'Please enter all required fields' });
    }

    if (errors.length > 0) {
        res.render('appointments', {
            errors,
            name,
            email,
            date,
            message
        });
    } else {
        try {
            // Save the appointment to the database (assuming you have an Appointment model)
            const newAppointment = new Appointment({ name, email, date, message });
            await newAppointment.save();
            req.flash('success_msg', 'Your appointment has been booked');
            res.redirect('/appointments');
        } catch (err) {
            console.error('Error booking appointment:', err);
            req.flash('error_msg', 'Error booking appointment');
            res.redirect('/appointments');
        }
    }
});

module.exports = router;