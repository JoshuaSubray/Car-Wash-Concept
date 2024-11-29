const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

/* GET payment page. */
router.get('/', function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.flash('error_msg', 'Please fill appointment details first.');
        return res.redirect('/appointments');
    }

    // calculate tax.
    const { name, email, date, message, package, price } = req.session.appointmentData;
    const tax = 0.13;
    const taxPrice = (parseFloat(price) * tax).toFixed(2);
    const totalPrice = (parseFloat(price) + parseFloat(taxPrice)).toFixed(2);
    req.session.totalPrice = totalPrice; // save total price so post can access it.

    res.render('payment', { title: 'Payment', name, email, date, message, package, price, tax, taxPrice, totalPrice });
});

// payment page validation.
router.post('/', async (req, res) => {
    const { userPayment } = req.body;

    const { name, email, date, message, package, price } = req.session.appointmentData;
    const totalPrice = req.session.totalPrice; // retrieve total price from get.

    // check if user pays correct amount.
    if (parseFloat(userPayment) !== parseFloat(totalPrice)) {
        req.flash('error_msg', 'Incorrect amount. Please try again.');
        return res.redirect('/payment');
    }
    try {
        // save the appointment to the database.
        const newAppointment = new Appointment({ name, email, date, message, package, price });
        await newAppointment.save();
        req.flash('success_msg', 'Your appointment has been booked! View your ticket in your Profile.');
        req.session.appointmentDate = null; // clear appointment data after saving.
        res.redirect('/appointments');
    } catch (err) {
        console.error('Error booking appointment:', err);
        req.flash('error_msg', 'Error booking appointment');
        res.redirect('/appointments');
    }
});

module.exports = router;