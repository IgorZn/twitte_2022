const User = require('../models/User.model')
const colors = require('colors');

// @desc        Profile page
// @route       GET /
// @access      Public
exports.profile = async (req, res, next) => {
    const username = req.params.username
    const user = req.session.user
    const payload = await User.getPayload(username, user)
    console.log('Profile page>>>',user)
    res.render('profilePage', payload);
};