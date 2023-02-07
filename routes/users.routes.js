const express = require('express');
const router = express.Router();

/* Controllers */
const {users} = require("../controllers/users.controllers");

/* GET users listing. */
router.route('/')
    .get(users);

module.exports = router;
