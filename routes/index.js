const express = require('express');
const methodOverride = require('method-override');
const router = express.Router();
const { mongoose, loginConnection } = require('../config/db');
const contact = require('./contact');

router.use(express.urlencoded({ extended: true }));
router.use(methodOverride('_method'));

// user router.
const usersRouter = require('./users');
router.use('/users', usersRouter);

// appointments router.
const appointmentsRouter = require('./appointments');
router.use('/appointments', appointmentsRouter);

// payment router.
const paymentRouter = require('./payment');
router.use('/payment', paymentRouter);

// reviews router.
const reviewsRouter = require('./reviews');
router.use('/reviews', reviewsRouter);

router.use('/contact', contact);

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Welcome to JAJ Car Wash' });
});

/* GET about page. */
router.get('/about', function (req, res, next) {
  res.render('about', { title: 'About Us' });
});

/* GET prices page. */
router.get('/prices', function (req, res, next) {
  res.render('prices', { title: 'Our Prices' });
});

/* GET contact page. */
router.get('/contact', function (req, res, next) {
  res.render('contact', { title: 'Contact Us' });
});

module.exports = router;
