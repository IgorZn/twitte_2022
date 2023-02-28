const express = require('express');
const router = express.Router();

/* Controllers */
const {inboxPage, newMessagesPage, chatPage} = require("../controllers/messages.controllers");

/* Middleware */
const {requireLogin} = require("../middleware/auth.middleware");

router.use(requireLogin);

router.route('/')
    .get(inboxPage)

router.route('/new')
    .get(newMessagesPage)

router.route('/:chatId')
    .get(chatPage)


module.exports = router;