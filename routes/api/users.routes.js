const express = require('express');
const router = express.Router();

// Controllers
const {requireLogin} = require("../../middleware/auth.middleware");
const {follow, ApiProfileFollowing, ApiProfileFollowers} = require("../../controllers/api/users.controllers");


router.route('/:id/follow')
    .put(requireLogin, follow)

router.route('/:id/following')
    .get(requireLogin, ApiProfileFollowing)

router.route('/:id/followers')
    .get(requireLogin, ApiProfileFollowers)


module.exports = router;