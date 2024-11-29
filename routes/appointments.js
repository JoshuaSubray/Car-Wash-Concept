// const express = require('express');
// const router = express.Router();
// const Appointment = require('../models/Appointment');

// /* GET appointments page. */
// router.get('/', function (req, res, next) {
//     if (!req.isAuthenticated()) { // must be logged in to make an appointment.
//         req.flash('error_msg', 'Please log in to book an appointment.');
//         return res.redirect('/users/login');
//     }
//     res.render('appointments', { title: 'Appointments' });
// })

// // appointments page validation.
// router.post('/', async (req, res) => {
//     const { name, email, date, message } = req.body;
//     let errors = [];

//     if (!name || !email || !date) {
//         errors.push({ msg: 'Please enter all required fields' });
//     }

//     if (errors.length > 0) {
//         res.render('appointments', {
//             errors,
//             name,
//             email,
//             date,
//             message
//         });
//     } else {
//         try {
//             // Save the appointment to the database (assuming you have an Appointment model)
//             const newAppointment = new Appointment({ name, email, date, message });
//             await newAppointment.save();
//             req.flash('success_msg', 'Your appointment has been booked');
//             res.redirect('/appointments');
//         } catch (err) {
//             console.error('Error booking appointment:', err);
//             req.flash('error_msg', 'Error booking appointment');
//             res.redirect('/appointments');
//         }
//     }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');

/* GET appointments page. */
router.get('/', async function (req, res, next) {
    if (!req.isAuthenticated()) { // must be logged in to make an appointment.
        req.flash('error_msg', 'Please log in to book an appointment.');
        return res.redirect('/users/login');
    }

    try {
        // Fetch appointments for the logged-in user
        const userAppointments = await Appointment.find({ email: req.user.email });
        res.render('appointments', { 
            title: 'Appointments', 
            appointments: userAppointments 
        });
    } catch (err) {
        console.error('Error fetching appointments:', err);
        req.flash('error_msg', 'Error fetching appointments. Please try again later.');
        res.render('appointments', { 
            title: 'Appointments', 
            appointments: [] 
        });
    }
});

// POST route for booking an appointment.
router.post('/', async (req, res) => {
    const { name, email, date, message } = req.body;
    let errors = [];

    // Validate required fields
    if (!name || !email || !date) {
        errors.push({ msg: 'Please enter all required fields' });
    }

    if (errors.length > 0) {
        // Render the form again with error messages and user input
        return res.render('appointments', {
            title: 'Appointments',
            errors,
            name,
            email,
            date,
            message,
            appointments: [] // Ensure appointments are passed
        });
    }

    try {
        // Save the new appointment to the database
        const newAppointment = new Appointment({ name, email, date, message });
        await newAppointment.save();
        req.flash('success_msg', 'Your appointment has been booked successfully!');
        res.redirect('/appointments');
    } catch (err) {
        console.error('Error booking appointment:', err);
        req.flash('error_msg', 'Error booking your appointment. Please try again later.');
        res.redirect('/appointments');
    }
});

module.exports = router;
