// @desc        Get notifications
// @route       GET /api/v1/notifications
// @access      Private
exports.getNotifications = async (req, res, next) => {
    res
        .status(200)
        .json({status: true, data: null})


};