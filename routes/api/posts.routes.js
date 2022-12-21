const express = require('express');
const router = express.Router();

// Controllers
const {addPost, getPosts} = require("../../controllers/api/posts.controllers");


router.route('/')
    .get(getPosts)
    .post(addPost)


module.exports = router;