const express = require('express');
const router = express.Router();
const { User, UserLogin } = require('../models/User');
const Appointment = require('../models/Appointment');
const passport = require('passport');
const Reviews = require('../models/Reviews');

/* GET register page. */
router.get('/register', function (req, res, next) {
  res.render('register', { title: 'Register' });
});

// register page validation.
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  let errors = [];

  if (!username || !email || !password) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      username,
      email,
      password
    });
  } else {
    try {
      let user = await User.findOne({ email });
      if (user) {
        req.flash('error_msg', 'Email already registered');
        return res.redirect('/users/register');
      }
      user = new User({ username, email, password });
      await user.save();
      req.flash('success_msg', 'You are now registered and can log in');
      res.redirect('/');
    } catch (err) {
      console.error('Error registering user:', err);
      req.flash('error_msg', 'Error registering user');
      res.redirect('/users/register');
    }
  }
});

/* GET login page. */
router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Login' });
});

// authenticate login page.
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect('/users/login');
    req.logIn(user, (err) => {
      if (err) return next(err);
      req.flash('success_msg', 'Successfully logged in!');
      return res.redirect('/');
    });
  })(req, res, next);
});

// logout page. 
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash('success_msg', 'Successfully logged out!');
    res.redirect('/');
  });
});

// GET profile page.
router.get('/profile', async (req, res) => {
  if (!req.isAuthenticated()) {
    req.flash('error_msg', 'Please log in to view your profile');
    return res.redirect('/users/login');
  }
  try {
    let appointments = [];
    let reviews = [];

    // if user's account type is admin, all appointments are viewable.
    if (req.user.type === 'admin') {
      appointments = await Appointment.find().sort({ date: 1 });
    } else { // if user's account type is customer, only their appointments are viewable.
      appointments = await Appointment.find({ email: req.user.email }).sort({ date: 1 });
    }

    reviews = await Reviews.find({ email: req.user.email }).sort({ date: -1 })

    res.render('profile', { title: 'Your Profile', user: req.user, appointments, reviews });
  } catch (err) {
    console.error('Error fetching appointments:', err);
    req.flash('error_msg', 'Error fetching appointments or reviews');
    res.redirect('/');
  }
});

module.exports = router;