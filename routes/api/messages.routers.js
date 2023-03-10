const express = require('express');
const router = express.Router();

// Controllers
const {requireLogin} = require("../../middleware/auth.middleware");
const {createChatMessage} = require("../../controllers/api/messages.controllers");


router.use(requireLogin);

router.route('/')
    .post(createChatMessage)


module.exports = router;