const express = require('express');
const router = express.Router();

// Controllers
const {requireLogin} = require("../../middleware/auth.middleware");
const {getNotifications, updateStatusOfNotification, updateStatusOfAllNotification} = require("../../controllers/api/notificationApi.constrollers");


router.use(requireLogin);

router.route('/')
    .get(getNotifications)

router.route('/:id/markAsOpened')
    .put(updateStatusOfNotification)

router.route('/markAsOpened')
    .put(updateStatusOfAllNotification)


module.exports = router;