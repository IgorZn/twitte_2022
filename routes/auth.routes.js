const express = require('express');
const routerLogin = express.Router();
const routerRegister = express.Router();

/* Controllers */
const {loginUser, registerUser} = require("../controllers/auth.controllers");

routerLogin.route('/')
    .get(loginUser)

routerRegister.route('/')
    .get(registerUser)

module.exports = { routerLogin, routerRegister };
