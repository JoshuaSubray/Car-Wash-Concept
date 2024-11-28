const express = require('express');
const router = express.Router();
const { User, UserLogin } = require('../models/User');
const passport = require('passport');

/* GET register page. */
router.get('/register', function(req, res, next) {
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
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

// authenticate login page.
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

module.exports = router;