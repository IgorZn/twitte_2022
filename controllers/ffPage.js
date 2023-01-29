const User = require("../models/User.model");
const mongoose = require("mongoose");

// @desc        Profile page
// @route       GET /:username/following
// @access      Public
exports.profileFollowing = async (req, res, next) => {
    console.log('profileFollowing>>>', req.params)

    const payload = {
        title: 'Express PISIKO',
        user: req.session.user,
        id: req.params.id,
        userLoggedJs: JSON.stringify(req.session.user),
        status: true
    }
    payload.selectedTab = 'following'
    res.render('followers_and_following', payload);

};

// @desc        Profile page
// @route       GET /:username/followers
// @access      Public
exports.profileFollowers = async (req, res, next) => {
    console.log('profileFollowers>>>', req.params)
    const payload = {
        title: 'Express PISIKO',
        user: req.session.user,
        id: req.params.id,
        userLoggedJs: JSON.stringify(req.session.user),
        status: true
    }
    payload.selectedTab = 'followers'
    res.render('followers_and_following', payload);
};