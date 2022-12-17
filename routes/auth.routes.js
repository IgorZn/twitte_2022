const express = require('express');
const routerLogin = express.Router();
const routerRegister = express.Router();
const routerLogout = express.Router();

/* Controllers */
const { loginUser, registerUser, getRegisterPage, logOut} = require("../controllers/auth.controllers");

routerLogin.route('/')
    .get(loginUser)
    .post(loginUser)

routerLogout.route('/')
    .get(logOut)

routerRegister.route('/')
    .get(getRegisterPage)
    .post(registerUser)

module.exports = { routerLogin, routerRegister, routerLogout };
