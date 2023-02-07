const express = require('express');
const router = express.Router();

// Controllers
const {requireLogin} = require("../../middleware/auth.middleware");
const {follow, ApiProfileFollowing, ApiProfileFollowers, ApiProfilePicture, ApiCoverPicture} = require("../../controllers/api/users.controllers");

router.use(requireLogin);

router.route('/:id/follow')
    .put(follow)

router.route('/:id/following')
    .get(ApiProfileFollowing)

router.route('/:id/followers')
    .get(ApiProfileFollowers)

router.route('/profilePicture')
    .post(ApiProfilePicture)

router.route('/profileCoverImage')
    .post(ApiCoverPicture)

module.exports = router;