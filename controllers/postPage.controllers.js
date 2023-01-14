const colors = require('colors');

// @desc        Post page
// @route       GET /:id
// @access      Public
exports.postPage = async (req, res, next) => {
    const payload = {
        title: 'Post details',
        user: req.session.user,
        userLoggedJs: JSON.stringify(req.session.user),
        postId: req.params.id
    }

    res
        .status(200)
        .render('postPage', payload);
};