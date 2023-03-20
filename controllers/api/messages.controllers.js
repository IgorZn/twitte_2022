const Message = require("../../models/Message.model");
const Chat = require("../../models/Chat.model");
const User = require("../../models/User.model");
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
                    // await User.populate(message, {path: 'sender'})
                    await message.populate(['sender', 'chat'])
                    await message.populate({path: 'chat', populate: {path: 'users'}})

                    // Add latest message to chat
                    /*
                    * Т.е. каждый раз когда мы создаем сообщение в чате
                    * мы его перезаписываем/обновляем в самом объекте чата (Chat model)
                    * в поле "latestMessage", а потом (при выводе всех комнат
                    * чата ч/з"createChatMessage", в список на странице) мы берем
                    * это поле и выводим его, предварительно детализировал по
                    * "sender", чтобы в "getLatestMessage" могли указать отправителя
                    * и сообщение
                    *
                    * */
                    await Chat.findByIdAndUpdate(chatId, { latestMessage: message})
                        .then(data => {
                            // console.log('latestMessage: message>>', data)
                        })
                        .catch( err => next(new ErrResponse(err, 404)))

                    res
                        .status(201)
                        .json({success: true, data: message})
                })
        })
        .catch(err => next(new ErrResponse(err, 404)))


};