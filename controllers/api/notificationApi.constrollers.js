const Notifications = require('../../models/Notification.model')
const ErrResponse = require("../../utils/errorResponse");
const ObjectId = require('mongoose').Types.ObjectId;

// @desc        Get notifications
// @route       GET /api/v1/notifications
// @access      Private
exports.getNotifications = async (req, res, next) => {
    const userID = req.session.user._id
    // console.log('getNotifications>>>', userID)

    const searchObj = {
        userTo: new ObjectId(userID),
        notificationType: {
            '$ne': 'newMessage'
        }
    }

    /**
     * */
    if (req.query.unreadOnly && req.query.unreadOnly.includes(true)) {
        searchObj.opened = false
    }

    await Notifications.find(searchObj)
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


// @desc        Update notification status: new/opened
// @route       PUT /api/v1/notifications/:id/markAsOpened
// @access      Private
exports.updateStatusOfNotification = async (req, res, next) => {
    const notificationID = req.params.id
    // console.log('getNotifications>>>', userID)

    await Notifications.findByIdAndUpdate(notificationID, {opened: true})
        .then(() => {
            res
                .status(200)
                .json({status: true})
        })
        .catch(err => next(new ErrResponse(err, 404)))


};


// @desc        Update notification status all to opened
// @route       PUT /api/v1/notifications/markAsOpened
// @access      Private
exports.updateStatusOfAllNotification = async (req, res, next) => {
    const userID = req.session.user._id
    // console.log('getNotifications>>>', userID)

    await Notifications.updateMany({userTo: userID}, {opened: true})
        .then(() => {
            res
                .status(200)
                .json({status: true})
        })
        .catch(err => next(new ErrResponse(err, 404)))


};