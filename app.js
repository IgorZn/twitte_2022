const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const connDB = require("./conf/db");
const dotenv = require("dotenv");

const session = require('express-session'),
    redisStorage = require('connect-redis')(session)
    Redis = require("ioredis")

// Load env consts
dotenv.config({path: './conf/config.env'});

// Connect to DB
connDB()


const app = express();

// const redisClient = new Redis()
app.use(
    session({
        // store: new redisStorage({
        //     ttl: 3600000,
        //     host: 'localhost',
        //     port: 6379,
        //     client: redisClient,
        // }),
        resave: false,
        secret: process.env.SESSION_SECRET,
        saveUninitialized: true,
    }))

/* Routes */
const indexRouter = require('./routes/index.routes');
const usersRouter = require('./routes/users.routes');
const {routerLogin, routerRegister, routerLogout} = require('./routes/auth.routes')

/* API routes*/
const postsRoutes = require('./routes/api/posts.routes')

/* View engine setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/* Mount routes */
app.use('/', indexRouter);
app.use('/login', routerLogin)
app.use('/register', routerRegister)
app.use('/logout', routerLogout)
app.use('/users', usersRouter);

/* Api routes*/
app.use('/api/v1/posts', postsRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});


// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
