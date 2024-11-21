const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(methodOverride('_method'));

const uri = 'mongodb+srv://jamesgriffiths23:1054g087@central.r9mof.mongodb.net/userAuth';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err));

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

module.exports = router;
