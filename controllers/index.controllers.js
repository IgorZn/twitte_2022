// @desc        Index page
// @route       GET /
// @access      Public
exports.index = (req, res, next) => {
    const payload = {
        title: 'Express PISIKO',
        user: req.session.user
    }
    res.render('index', payload);
};