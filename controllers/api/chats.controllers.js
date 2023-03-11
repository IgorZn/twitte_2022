const Chat = require("../../models/Chat.model");
const User = require("../../models/User.model");
const Messages = require("../../models/Message.model");
const ErrResponse = require("../../utils/errorResponse");


// @desc        Create chat
// @route       POST /api/v1/chats
// @access      Private
exports.createChat = async (req, res, next) => {
    // console.log('createChat>>>', JSON.parse(req.body.users))

    const users = JSON.parse(req.body.users)

    if (!req.body.users || users.length == 0) {
        next(new ErrResponse('User object is empty or params not found', 404))
    }

    // add himself to users an array
    users.push(req.session.user)

    const createChat = {
        users,
        isGroupChat: true
    }

    return await Chat.create(createChat)
        .then(data => {
            // console.log('Chat.create>>', data)
            res
                .status(201)
                .json({status: true, data})
        })
        .catch(err => {
            console.log('Chat.create, err>>', err)
            next(new ErrResponse(err, 404))
        })


};


// @desc        Create chat
// @route       POST /api/v1/chats
// @access      Private
exports.startChatRoom = async (req, res, next) => {
    /*
    * https://www.mongodb.com/docs/manual/reference/operator/query/elemMatch/
    *
    *   // objects
    *   { _id: 1, results: [ 82, 85, 88 ] }
    *   { _id: 2, results: [ 75, 88, 89 ] }
    *
    *   // query
    *   db.scores.find(
    *       { results: { $elemMatch: { $gte: 80, $lt: 85 } } } )
    *
    *   // return
    *   { "_id" : 1, "results" : [ 82, 85, 88 ] }
    *
    * */

    await Chat.find({users: {$elemMatch: {$eq: req.session.user._id}}})
        .populate("users")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .exec()
        .then(async results => {
            // Add fullname
            results.forEach(chatUsersObj => {
                chatUsersObj.users.forEach(async user => {
                    user.fullName = await User.getFullUserName(user)
                    // console.log('data.forEach (user.fullName)>>>', user.fullName)
                })
            })

            /*
            * если у нас есть "latestMessage", то мы его детализируем
            * */
            const data = await User.populate(results, {path: "latestMessage.sender"})


            res
                .status(200)
                .json({success: true, data})
        })
        .catch(err => {
            console.log(err)
            next(new ErrResponse(err, 404))
        })
};


// @desc        Update chat name
// @route       PUT /api/v1/chats/:id
// @access      Private
exports.updateChatName = async (req, res, next) => {
    const chatId = req.params.id
    const newChatName = req.body
    await Chat.findByIdAndUpdate(chatId, newChatName)
        .exec()
        .then(() => {
            res
                .status(200)
                .json({success: true})
        })
        .catch(err => {
            console.log(err)
            next(new ErrResponse(err, 404))
        })
}


// @desc        Display chat messages
// @route       GET /api/v1/chats/:chatId/messages
// @access      Private
exports.chatPageMessages = async (req, res, next) => {
    await Messages.find({chat: req.params.chatId})
        .populate("sender")
        .exec()
        .then(data => {
            return res
                .status(200)
                .json({success: true, data})
        }).catch(err => next(new ErrResponse(err, 404)))
};