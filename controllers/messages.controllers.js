const Chat = require("../models/Chat.model");

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


// @desc        Chat page
// @route       GET /:chatId
// @access      Private
exports.chatPage = async (req, res, next) => {
    const chatId = await Chat.checkId(req.params.chatId) ? req.params.chatId : false;
    const userId = req.session.user._id.toString()

    const payload = {
        status: true,
        title: 'Chat',
        user: req.session.user,
        id: req.session.user._id.toString(),
        userLoggedJs: JSON.stringify(req.session.user),
    }

    if (!chatId) {
        payload.status = false
        return res
            .status(200)
            .render('chatPage', payload);
    }

    await Chat.findOne({_id: chatId, users: {$elemMatch: {$eq: userId}}})
        .populate("users")
        .exec()
        .then(data => {
            if (data) {
                payload.chat = data
                res
                    .status(200)
                    .render('chatPage', payload);
            } else {
                payload.status = false
                res
                    .status(200)
                    .render('chatPage', payload);
            }

        })


};