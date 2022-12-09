const express = require('express');
const router = express.Router();

/* Controllers */
const {index} = require("../controllers/index.controllers");

/* Middleware */
const {requireLogin} = require("../middleware/auth.middleware");

/* GET home page. */
router.route('/')
    .get(requireLogin, index);

module.exports = router;
