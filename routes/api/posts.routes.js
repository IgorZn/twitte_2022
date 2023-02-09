const express = require('express');
const router = express.Router();

// Controllers
const {addPost, getPosts, likePost, retweetPost, getPostByID, deletePost, pinUnpinPost} = require("../../controllers/api/posts.controllers");
const {requireLogin} = require("../../middleware/auth.middleware");


router.route('/')
    .get(getPosts)
    .post(requireLogin, addPost)


router.route('/:id/like')
    .put(requireLogin, likePost)

router.route('/:id/retweet')
    .post(requireLogin, retweetPost)

router.route('/:id')
    .get(requireLogin, getPostByID)
    .delete(requireLogin, deletePost)
    .put(requireLogin, pinUnpinPost)

module.exports = router;