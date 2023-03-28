const express = require('express');
const router = express.Router();

// Controllers
const {requireLogin} = require("../../middleware/auth.middleware");
const {getNotifications, updateStatusOfNotification} = require("../../controllers/api/notificationApi.constrollers");


router.use(requireLogin);

router.route('/')
    .get(getNotifications)

router.route('/:id/markAsOpened')
    .put(updateStatusOfNotification)


module.exports = router;