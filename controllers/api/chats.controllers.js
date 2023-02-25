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
                .status(201)
                .json({status: true, data})
        })
        .catch(err => {
            console.log('Chat.create, err>>', err)
            next(new ErrResponse(err, 404))
        })


};


// @desc        Create chat
// @route       POST /api/v1/chats/:id
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

    await Chat.find({ users: { $elemMatch: { $eq: req.session.user._id}}})
        .exec()
        .then( data => {
            res
                .status(200)
                .json({success: true, data})
        })
        .catch(err => {
            next(new ErrResponse(err, 404))
        })
};
