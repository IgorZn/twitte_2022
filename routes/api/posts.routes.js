const express = require('express');
const router = express.Router();

// Controllers
const {addPost, getPosts, likePost} = require("../../controllers/api/posts.controllers");


router.route('/')
    .get(getPosts)
    .post(addPost)


router.route('/:id/like')
    .put(likePost)

module.exports = router;