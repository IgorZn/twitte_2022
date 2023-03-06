const express = require('express');
const router = express.Router();

// Controllers
const { createChat, startChatRoom, updateChatName} = require("../../controllers/api/chats.controllers")
const { requireLogin } = require("../../middleware/auth.middleware");

router.use(requireLogin);

router.route('/')
    .post(createChat)

router.route('/:id')
    .put(updateChatName)

router.route('/')
    .get(startChatRoom)



module.exports = router;