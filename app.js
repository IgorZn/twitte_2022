const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const connDB = require("./conf/db");
const dotenv = require("dotenv");
const session = require('express-session')

// Load env consts
dotenv.config({ path: './conf/config.env' });

// Connect to DB
connDB()

/* Routes */
const indexRouter = require('./routes/index.routes');
const usersRouter = require('./routes/users.routes');
const { routerLogin, routerRegister } = require('./routes/auth.routes')

const app = express();

/* View engine setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
  }
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* Mount routes */
app.use('/', indexRouter);
app.use('/login', routerLogin)
app.use('/register', routerRegister)
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
