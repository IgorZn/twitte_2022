const express = require('express');
const router = express.Router();

/* Controllers */
const { profile } = require("../controllers/profile.controllers");

/* Middleware */
const {requireLogin} = require("../middleware/auth.middleware");

/* GET home page. */
router.route('/:username')
    .get(requireLogin, profile);

module.exports = router;
