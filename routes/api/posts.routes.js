const express = require('express');
const router = express.Router();

// Controllers
const {addPost, getPosts, likePost, retweetPost, getPostByID, deletePost, pinUnpinPost} = require("../../controllers/api/posts.controllers");
const {requireLogin} = require("../../middleware/auth.middleware");

router.use(requireLogin);

router.route('/')
    .get(getPosts)
    .post(addPost)


router.route('/:id/like')
    .put(likePost)

router.route('/:id/retweet')
    .post(retweetPost)

router.route('/:id')
    .get(getPostByID)
    .delete(deletePost)
    .put(pinUnpinPost)

module.exports = router;