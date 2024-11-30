var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash = require('connect-flash');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var reviewsRouter = require('./routes/reviews'); // Import the reviews route
var passport = require('./config/passport'); 
const Appointment = require('./models/Appointment');
var app = express();

// view engine middleware.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session middleware.
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

// flash middleware.
app.use(flash());

// initialize passport.
app.use(passport.initialize());
app.use(passport.session());

// make flash messages and user object available in all views.
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

// router.
app.use('/', indexRouter);
app.use('/users', usersRouter); // Ensure this line is present
app.use('/reviews', reviewsRouter); // Add the reviews route

app.post('/appointments/:id/cancel', async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Appointment canceled successfully.');
    res.redirect('/profile');
  } catch (err) {
    req.flash('error_msg', 'Failed to cancel appointment.');
    res.redirect('/profile');
  }
});

// catch error 404 and forward to error handler.
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler.
app.use(function(err, req, res, next) {
  // set locals, only providing error in development.
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page.
  res.status(err.status || 500);
  res.render('error');
});

// port.
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Open your browser at 'http://localhost:${port}'.`);
});

module.exports = app;