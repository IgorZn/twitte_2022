const express = require('express');
const router = express.Router();

/* Controllers */
const {search, searchSelectedTab} = require("../controllers/search.controllers");


/* Middleware */
const {requireLogin} = require("../middleware/auth.middleware");

router.use(requireLogin);

/* GET search page. */
router.route('/')
    .get(search);

router.route('/:selectedTab')
    .get(searchSelectedTab);


module.exports = router;