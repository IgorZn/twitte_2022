const express = require('express');
const router = express.Router();

// Controllers
const {requireLogin} = require("../../middleware/auth.middleware");
const {follow} = require("../../controllers/api/users.controllers");


router.route('/:id/follow')
    .put(requireLogin, follow)


module.exports = router;