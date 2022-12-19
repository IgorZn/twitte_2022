const express = require('express');
const router = express.Router();

// Controllers
const {addPost} = require("../../controllers/api/posts.controllers");


router.route('/')
    .post(addPost)


module.exports = router;