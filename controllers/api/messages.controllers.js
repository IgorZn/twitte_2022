const Message = require("../../models/Message.model");
const Chat = require("../../models/Chat.model");
const ErrResponse = require("../../utils/errorResponse");


// @desc        Processing chat messages
// @route       POST /api/v1/messages
// @access      Private
exports.createChatMessage = async (req, res, next) => {
    // console.log('createChat>>>', req.body)
    // res
    //     .status(201)
    //     .json({status: true, data: 'req.body == ХУЙ'})

    const chatId = req.body.chatId
    const userId = req.session.user._id
    const content = req.body.content

    if(!chatId || !content){
        next(new ErrResponse('No chatId or content', 404))
    }

    await Chat.findById(chatId)
        .exec()
        .then(async data => {
            await Message.create({sender: userId, content, chat: chatId})
                .then(async message => {
                    res
                        .status(201)
                        .json({success: true, data: message})
                })
        })
        .catch(err => next(new ErrResponse(err, 404)))


};