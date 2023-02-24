const Chat = require("../../models/Chat.model");
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
            console.log('Chat.create>>', data)
            res
                .status(200)
                .json({status: true, data})
        })
        .catch(err => {
            console.log('Chat.create, err>>', err)
            next(new ErrResponse(err, 404))
        })


};