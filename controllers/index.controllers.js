// @desc        Index page
// @route       GET /
// @access      Public
exports.index = (req, res, next) => {
    res.render('index', {title: 'Express'});
};