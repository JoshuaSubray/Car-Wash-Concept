const express = require('express');
const methodOverride = require('method-override');
const router = express.Router();
const { mongoose, loginConnection } = require('../config/db');

router.use(express.urlencoded({ extended: true }));
router.use(methodOverride('_method'));

const usersRouter = require('./users');
router.use('/users', usersRouter); // Added users router

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Welcome to JAJ Car Wash ' });
});

/* GET about page. */
router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About Us' });
});

/* GET prices page. */
router.get('/prices', function(req, res, next) {
  res.render('prices', { title: 'Our Prices' });
});

/* GET reviews page. */
router.get('/reviews', function(req, res, next) {
  res.render('reviews', { title: 'Customer Reviews' });
});

/* GET contact page. */
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact Us' });
});

router.get('/appointments', function(req, res, next) {
  res.render('appointments', { title: 'Appointments' });
})

router.post('/appointments', async (req, res) => {
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
