const express = require('express');
const router = express.Router();

/* Controllers */
const { profile, profileReplies} = require("../controllers/profile.controllers");

/* Middleware */
const {requireLogin} = require("../middleware/auth.middleware");

/* GET profile page. */
router.route('/')
    .get(requireLogin, profile);

router.route('/:username')
    .get(requireLogin, profile);

router.route('/:username/replies')
    .get(requireLogin, profileReplies);

module.exports = router;
