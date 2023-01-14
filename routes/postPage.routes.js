const express = require('express');
const router = express.Router();

/* Controllers */
const {postPage} = require("../controllers/postPage.controllers");

/* Middleware */
const {requireLogin} = require("../middleware/auth.middleware");

router.route('/:id')
    .get(requireLogin, postPage)


module.exports = router;