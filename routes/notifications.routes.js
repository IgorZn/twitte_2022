const express = require('express');
const router = express.Router();

/* Controllers */
const { notificationsPage } = require("../controllers/notifications.controllers");

/* Middleware */
const { requireLogin } = require("../middleware/auth.middleware");

router.use(requireLogin);

router.route('/')
    .get(notificationsPage)



module.exports = router;