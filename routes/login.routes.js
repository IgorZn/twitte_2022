const express = require('express');
const router = express.Router();

/* Controllers */
const {loginUser} = require("../controllers/auth.controllers");

router.route('/')
    .get(loginUser)


module.exports = router;
