const Post = require('../../models/Post.model')
const User = require('../../models/User.model')
const colors = require('colors');

// @desc        Add post
// @route       POST /api/v1/posts
// @access      Private
exports.addPost = async (req, res, next) => {
    console.log(req.body)
    const {content, replyTo} = req.body
    if (!content) {
        console.log("Content is empty")
        return res
            .status(400)
            .json({success: true, data: "No data in content"});
    }

    const context = {
        content,
        postedBy: req.session.user,
        replyTo
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


// @desc        Get post by ID
// @route       GET /api/v1/posts/:id
// @access      Private
exports.getPostByID = async (req, res, next) => {
    await Post.findById(req.params.id)
        .populate({
            path: 'postedBy',
            select: 'firstName lastName username profilePic'
        })
        .populate('replyTo')
        .then(async data => {
            data = await User.populate(data, {path: 'replyTo.postedBy'})
            const context = {
                success: true,
                data,
            }

            const replies = await Post.getPosts({replyTo: data._id})
            if (replies.length > 0) context.replies = replies

            res
                .status(201)
                .json(context)
        })
        .catch(err => {
            console.log(`${err}`.bgRed)
            next(err)
        })


};


// @desc        Like post
// @route       POST /api/v1/:id/like
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


// @desc        Delete post
// @route       DELETE /api/v1/:id
// @access      Private
exports.deletePost = async (req, res, next) => {
    const postID = req.params.id
    const userID = req.session.user._id

    await Post.findById(postID)
        .exec()
        .then(async result => {
            if (result.postedBy.toString() === userID) {
                await Post.findByIdAndDelete(postID)
                    .exec()
                    .then(delResult => {
                        return res
                            .status(202)
                            .json({success: true, data: delResult})
                    })
                    .catch(err => next(err))
            }
        })
        .catch(err => next(err))


};


// @desc        Pin post
// @route       PUT /api/v1/:id
// @access      Private
exports.pinUnpinPost = async (req, res, next) => {
    const userID = req.session.user._id

    if (req.body.pinned) {
        await Post.updateMany({postedBy: userID}, {pinned: false})
            .catch(error => {
                console.log(error);
                res.sendStatus(400);
            })
    }

    await Post.findByIdAndUpdate(req.params.id, req.body)
        .then((data) =>
            res
                .status(202)
                .json({success: true, data})
        )
        .catch(error => {
            console.log(error);
            res.sendStatus(400);
        })
};


// @desc        Retweet post
// @route       POST /api/v1/:id/retweet
// @access      Private
exports.retweetPost = async (req, res, next) => {

    const postID = req.params.id
    const userID = req.session.user._id

    // Try and delete retweet
    const deletedPost = await Post.findOneAndDelete({postedBy: userID, retweetData: postID})
        .catch(err => console.log(err))

    /*
    * если null, то добавить
    * если не null, то удалить
    */
    const option = deletedPost != null ? "$pull" : "$addToSet"
    let repost = deletedPost

    if (repost === null) {
        repost = await Post.create({postedBy: userID, retweetData: postID})
            .catch(err => next(err))
    }

    // Insert user likes
    await User
        .findByIdAndUpdate(userID, {[option]: {retweets: repost._id}}, {new: true})
        .exec()
        .then(async data => {
            req.session.user = data

            // Insert post likes
            await Post
                .findByIdAndUpdate(postID, {[option]: {retweetUsers: userID}}, {new: true})
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
    console.log('getPosts>>>',req.query)
    if (!req.session.user) {
        res
            .status(404)
            .redirect('/login')
    };

    const searchObj = req.query;


    if (searchObj.isReply) {
        const isReply = searchObj.isReply == 'true'
        /*
        -- Content of Post and Replies tabs -- on PROFILE page

        This query will select all documents in the Posts
        collection where the replyTo field exists based on
        'isReply' value - true/false
         */
        searchObj.replyTo = {$exists: isReply}
        delete searchObj.isReply
    };

    if (searchObj.search) {
        console.log('if searchObj.search>>',searchObj.search)
        searchObj.content = { $regex: searchObj.search, $options: "i"}
        delete searchObj.search
    };

    if (searchObj.followingOnly) {
        const followingOnly = searchObj.followingOnly == 'true'

        if (followingOnly) {
            const objIds = req.session.user.following

            objIds.push(req.session.user._id)
            searchObj.postedBy = {$in: objIds}
        }

        delete searchObj.followingOnly

    };


    console.log('searchObj>>>', searchObj);

    return await Post.find(searchObj)
        .populate({
            path: 'postedBy',
            select: 'firstName lastName username profilePic'
        })
        .populate('replyTo')
        .populate('retweetData')
        .sort('field -createdAt') // по возрастания, а без "-" по убыванию
        .exec()
        .then(async data => {
            console.log('Post.find>>', data)
            // To make retweet post display normally as regular post with first and second name and so on...
            data = await User.populate(data, {path: 'replyTo.postedBy'})
            data = await User.populate(data, {path: 'retweetData.postedBy'})
            return res
                .status(200)
                .json({success: true, data, count: data.length})
        })
        .catch(err => next(err))

};