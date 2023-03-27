const Notifications = require('../../models/Notification.model')
const ErrResponse = require("../../utils/errorResponse");
const ObjectId = require('mongoose').Types.ObjectId;

// @desc        Get notifications
// @route       GET /api/v1/notifications
// @access      Private
exports.getNotifications = async (req, res, next) => {
    const userID = req.session.user._id
    // console.log('getNotifications>>>', userID)

    await Notifications.find({
        userTo: new ObjectId(userID),
        notificationType: {
            '$ne': 'newMessage'
        }
    })
        .populate("userTo")
        .populate("userFrom")
        .sort({createdAt: -1})
        .then(data => {
            data.fullName = data.fullName
            res
                .status(200)
                .json({status: true, data})
        })
        .catch(err => next(new ErrResponse(err, 404)))


};