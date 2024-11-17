const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

router.post('/register', function(req, res, next) {
  const { username, password } = req.body;
  let newUser = new User({
    username: username,
    password: bcrypt.hashSync(password, 10) // Use bcrypt to hash the password
  });

  newUser.save()
    .then(() => {
      req.flash('success_msg', 'You are registered and can now log in');
      res.redirect('/login');
    })
    .catch(err => {
      req.flash('error_msg', 'Error registering user');
      res.redirect('/register');
    });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/login', (req, res, next) => {
  const { email, password } = req.body;
  let errors = [];

  if (!email || !password) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (errors.length > 0) {
    res.render('login', {
      errors,
      email,
      password
    });
  } else {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next);
  }
});

module.exports = router;