const express = require('express');
const router = express.Router();

// Controllers
const { createChat } = require("../../controllers/api/chats.controllers")
const { requireLogin } = require("../../middleware/auth.middleware");

router.use(requireLogin);

router.route('/')
    .post(createChat)


module.exports = router;