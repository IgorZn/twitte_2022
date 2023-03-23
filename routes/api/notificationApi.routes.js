const express = require('express');
const router = express.Router();

// Controllers
const {requireLogin} = require("../../middleware/auth.middleware");
const {getNotifications} = require("../../controllers/api/notificationApi.constrollers");


router.use(requireLogin);

router.route('/')
    .get(getNotifications)


module.exports = router;