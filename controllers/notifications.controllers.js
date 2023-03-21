
// @desc        Notifications page
// @route       GET /
// @access      Private
exports.notificationsPage = async (req, res, next) => {
    const payload = {
        status: true,
        title: 'Notifications Page',
        user: req.session.user,
        userLoggedJs: JSON.stringify(req.session.user),
    }

    res
        .status(200)
        .render('notificationsPage', payload);
};