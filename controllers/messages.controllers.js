// @desc        Messages page
// @route       GET /
// @access      Private
exports.inboxPage = async (req, res, next) => {
    const payload = {
        status: true,
        title: 'Inbox',
        user: req.session.user,
        userLoggedJs: JSON.stringify(req.session.user),
    }

    res
        .status(200)
        .render('inboxPage', payload);
};


// @desc        New message page
// @route       GET /new
// @access      Private
exports.newMessagesPage = async (req, res, next) => {
    const payload = {
        status: true,
        title: 'New messages',
        user: req.session.user,
        id: req.session.user._id.toString(),
        userLoggedJs: JSON.stringify(req.session.user),
    }

    res
        .status(200)
        .render('newMessagesPage', payload);
};