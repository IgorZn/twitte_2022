const User = require('../models/User.model');
const ErrResponse = require("../utils/errorResponse");


// @desc        Login user
// @route       POST /login
// @access      Public
exports.loginUser = async (req, res, next) => {
    const {logUserName, logPassword} = req.body
    if (!res.session && !logUserName && !logPassword) {
        return res
            .status(200)
            .render("login", {title: 'Login page'})
    } else {
        await User.findOne({
            $or: [
                {username: logUserName},
                {email: logUserName}
            ]
        })
            .exec()
            .then(async user => {
                const isMatch = await User.matchPassword(logPassword, user.password);
                if (isMatch) {
                    req.session.user = user
                    req.session.key = req.sessionID
                }
            })
            .catch(err => {
                res
                    .status(200)
                    .render("login", {errorMessage: err})
            })

        return res
            .status(200)
            .redirect('/')
    }

    return res
        .status(200)
        .render("login", {errorMessage: "Make sure the credential is correct"})
};


// @desc        Logout user
// @route       GET /logout
// @access      Public
exports.logOut = async (req, res, next) => {
    console.log('logOut>>>', req.session)
    if (req.session) {
        req.session.destroy()
        return res
            .status(200)
            .redirect('/login')
    }
    return res
        .status(200)
        .redirect('/login')
};


// @desc        Register user
// @route       GET /register
// @access      Public
exports.getRegisterPage = async (req, res, next) => {
    res
        .status(200)
        .render("register", {title: 'Register page'})
};


// @desc        Register user
// @route       POST /register
// @access      Public
exports.registerUser = async (req, res, next) => {
    Object.keys(req.body).forEach(key => {
        if (!key.startsWith('pass')) {
            req.body[key] = req.body[key].trim()
        }
    })
    const {email, username} = req.body

    // All fields are present
    if (email && username) {
        await User.findOne({
            $or: [
                {username: username.trim()},
                {email: email.trim()}
            ]
        })
            .exec()
            .then(async user => {
                if (user) {
                    // User already exist
                    if (user.email === email || user.username === username) {
                        req.body.errorMessage = "Email or username already in use"
                        return res
                            .status(200)
                            .render("register", req.body)
                    }
                }

                // If no such user
                if (!user) {
                    // add password to DB
                    req.session.user = await User.create(req.body)
                    return res.redirect('/')
                }

            })
            .catch(err => {
                console.log(err);
                req.body.errorMessage = "Something went wrong"
                res
                    .status(200)
                    .render("register", req.body)

            });
    } else {
        req.body.errorMessage = "Please make sure field has a valid value"
        res
            .status(200)
            .render("register", req.body)
    }


};