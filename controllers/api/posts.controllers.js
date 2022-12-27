const Post = require('../../models/Post.model')
const User = require('../../models/User.model')

// @desc        Add post
// @route       POST /api/v1/posts
// @access      Private
exports.addPost = async (req, res, next) => {
    if (!req.body.content) {
        console.log("Content is empty")
        return res
            .status(400)
            .json({success: true, data: "No data in content"});
    }

    const context = {
        content: req.body.content,
        postedBy: req.session.user
    }

    await Post.create(context)
        .then(async data => {
            const populatedData = await User.populate(data, {path: 'postedBy'})
            res
                .status(201)
                .json({success: true, data: populatedData})
        })
        .catch(err => {
            res
                .status(403)
                .json({status: false, data: `content is longer than the maximum allowed length (140)`})
        })

};


// @desc        Like post
// @route       POST /api/v1/posts
// @access      Private
exports.likePost = async (req, res, next) => {
    const postID = req.params.id
    const userID = req.session.user._id
    /*
    *  есть или нет '.likes' в объекте сессия
    *  и если есть, то включает ли ID поста?
    * */
    const isLiked = req.session.user.likes && req.session.user.likes.includes(postID)

    /*
    *  isLiked -- true -- хотим удалить like, т.к. он уже есть
    *  isLiked -- false -- хотим like`кнуть пост, т.к. его нет в 'req.session.user.'
    * */


    /*
        $addToSet (множество) добавляет значение в массив,
        если только это значение уже не присутствует, и в этом случае
        $addToSet ничего не делает с этим массивом.

        $pull удаляет из существующего массива все
        экземпляры значения или значений, которые соответствуют
        указанному условию.
    */


    const option = isLiked ? "$pull" : "$addToSet"

    // Insert user likes
    await User
        .findByIdAndUpdate(userID, {[option]: {likes: postID}}, {new: true})
        .exec()
        .then(async data => {
            req.session.user = data

            // Insert post likes
            await Post
                .findByIdAndUpdate(postID, {[option]: {likes: userID}}, {new: true})
                .exec()
                .then(data => {
                    console.log('post>>>', data.likes.length)
                    res
                        .status(201)
                        .json({status: true, data, likes: data.likes.length})
                })
                .catch(err => next(err))


            // res
            //     .status(201)
            //     .json({status: true, data, likes: data.likes.length})
        })
        .catch(err => next(err))


};


// @desc        Get posts
// @route       GET /api/v1/posts
// @access      Private
exports.getPosts = async (req, res, next) => {
    if(!req.session.user){
        res
            .status(404)
            .redirect('/login')
    }

    await Post.find(({postedBy: req.session.user._id}))
        .populate({
            path: 'postedBy',
            select: 'firstName lastName username profilePic'
        })
        .sort('field -createdAt') // по возрастания, а без "-" по убыванию
        .exec()
        .then(data => {
            res
                .status(200)
                .json({success: true, data})
        })
        .catch(err => next(err))

};