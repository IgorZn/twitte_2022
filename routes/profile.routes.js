const express = require('express');
const router = express.Router();

/* Controllers */
const { profile, profileReplies } = require("../controllers/profile.controllers");
const { profileFollowing, profileFollowers } = require("../controllers/ffPage");

/* Middleware */
const {requireLogin} = require("../middleware/auth.middleware");

/* GET profile page. */
router.route('/')
    .get(requireLogin, profile);

router.route('/:username')
    .get(requireLogin, profile);

router.route('/:username/replies')
    .get(requireLogin, profileReplies);

/* Fg and Fs */
router.route('/:id/following')
    .get(requireLogin, profileFollowing);

router.route('/:id/followers')
    .get(requireLogin, profileFollowers);

module.exports = router;
