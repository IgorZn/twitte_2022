const colors = require('colors');

// @desc        Index page
// @route       GET /
// @access      Public
exports.index = (req, res, next) => {
    // console.log('req.session>>>', req.session)
    console.log('req.session.user>>>', req.session.user)
    console.log(`req.sessionID>>> ${req.sessionID}`.bold.blue, )
    // console.log('req.session.key>>>', req.session.key)
    // console.log('req.session.key[req.sessionID]>>>',req.session.key[req.sessionID])
    const payload = {
        title: 'Express PISIKO',
        user: req.session.user,
        userLoggedJs: JSON.stringify(req.session.user),
    }
    res.render('index', payload);
};