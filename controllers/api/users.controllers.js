const User = require('../../models/User.model')
const mongoose = require("mongoose");
const ErrResponse = require('../../utils/errorResponse')
const path = require("node:path");

// @desc        Retweet post
// @route       POST /api/v1/users/:id/follow
// @access      Private
exports.follow = async (req, res, next) => {
    const userID = req.params.id
    const sessionUserId = req.session.user._id
    console.log('userID, sessionUserId >>>', userID, sessionUserId)

    await User.findById(userID)
        .exec()
        .then(async result => {
            // console.log('result>>>', result)
            const isFollowing = result.followers.includes(sessionUserId)
            /*
            If isFollowing remove ($pull)
            from "following" or add ($addToSet)
            to an array
            */
            const option = isFollowing ? "$pull" : "$addToSet"
            console.log('isFollowing>>>', isFollowing)
            console.log('option>>>', option)

            // Insert/remove user into following
            // Current user start following with "userID"
            await User
                .findByIdAndUpdate(sessionUserId, {[option]: {following: userID}}, {new: true})
                .exec()
                .then(async user => {

                    // Add CURRENT user as follower for "userID"
                    await User
                        .findByIdAndUpdate(userID, {[option]: {followers: sessionUserId}}, {new: true})
                        .exec()
                        .then(followers => {
                            console.log('Followers updated')
                            console.log(followers.followers)
                        })
                        .catch(e => console.log('Add CURRENT user as follower on following user [error]', e))

                    // console.log('following>>>', user)
                    req.session.user = user
                    const data = req.session.user
                    return res
                        .status(201)
                        .json({status: true, data, isFollowing})
                })
                .catch(e => console.log('Current user start following with -userID- [error]', e))

        })

};


// @desc        Profile page
// @route       GET /:id/following
// @access      Public
exports.ApiProfileFollowing = async (req, res, next) => {
    console.log('Profile page>>>', req.params)
    await User.findById(req.params.id)
        .populate("following")
        .then(data => {
            res
                .status(200)
                .json({success: true, data});
        })
        .catch(err => next(err))

    // const payload = {
    //     title: 'Express PISIKO',
    //     user: req.session.user,
    //     userLoggedJs: JSON.stringify(req.session.user),
    //     status: true
    // }
    // payload.selectedTab = 'following'

};


// @desc        Search results on search page for user tab
// @route       GET /
// @access      Private
exports.searchUserTab = async (req, res, next) => {
    let searchObj = req.query
    let searchObjQuery
    console.log('searchObj>>>', searchObj)
    console.log('searchObj.search>>>', searchObj.search)

    if (req.query.search.length > 0) {
        searchObjQuery = {
            $or: [
                {firstName: {$regex: req.query.search, $options: "i"}},
                {lastName: {$regex: req.query.search, $options: "i"}},
                {userName: {$regex: req.query.search, $options: "i"}},
            ]
        }
    }


    console.log('searchUserTab__searchObjQuery>>>', searchObjQuery['or'])
    return await User.find(searchObjQuery)
        .exec()
        .then(data => {
            return res
                .status(200)
                .json({success: true, data, count: data.length})
        })
        .catch(err => next(new ErrResponse(err, 404)))

};


// @desc        Profile page
// @route       GET /:id/followers
// @access      Public
exports.ApiProfileFollowers = async (req, res, next) => {
    // console.log('Profile page>>>',user)
    console.log('Profile page>>>', req.params)
    await User.findById(req.params.id)
        .populate("followers")
        .then(data => {
            res
                .status(200)
                .json({success: true, data});
        })
        .catch(err => next(err))


    // const payload = {
    //     title: 'Express PISIKO',
    //     user: req.session.user,
    //     userLoggedJs: JSON.stringify(req.session.user),
    //     status: true
    // }
    // payload.selectedTab = 'followers'
    // res.render('followers_and_following', payload);
};


// @desc        Profile picture
// @route       POST /api/v1/users/profilePicture
// @access      Private
exports.ApiProfilePicture = async (req, res, next) => {
    let file, ext, uploadPath;

    file = req.files.croppedImage;

    if (!req.files || Object.keys(req.files).length === 0) {
        next(new ErrResponse('No FILES were uploaded.', 404));
    }

    // Check that is an image
    if (!file.mimetype.startsWith('image')) {
        next(new ErrResponse('Wrong IMAGE format.', 404));
    }

    ext = file.mimetype.split('/')[1]

    file.name = `photo_${req.session.user.username}_${Date.now()}.${ext}`
    uploadPath = path.join('.', process.env.FILE_UPLOAD_PATH, file.name)

    // console.log(req.session)

    await file.mv(uploadPath, async function (err) {
        if (err)
            console.log(err)
        return new ErrResponse(err, 404);

        console.log('User photo was update...'.green.bgCyan)
    })

    const picPath = `/uploads/${file.name}`
    await User.findByIdAndUpdate(req.session.user._id, {profilePic: picPath}, {new: true})
        .exec()
        .then(result => {
            // Update user session data
            req.session.user = result

            // Send response
            res
                .status(200)
                .json({success: true, data: file.name});
        })
        .catch(err => new ErrResponse(err, 404))

    // console.log('ApiProfilePicture', req.files); // the uploaded file object
};


// @desc        Profile picture
// @route       POST /api/v1/users/profilePicture
// @access      Private
exports.ApiCoverPicture = async (req, res, next) => {
    let file, ext, uploadPath, coverPic, uploads;
    coverPic = 'cover_pics'
    uploads = 'uploads'

    file = req.files.croppedImage;

    if (!req.files || Object.keys(req.files).length === 0) {
        next(new ErrResponse('No FILES were uploaded.', 404));
    }

    // Check that is an image
    if (!file.mimetype.startsWith('image')) {
        next(new ErrResponse('Wrong IMAGE format.', 404));
    }

    ext = file.mimetype.split('/')[1]

    file.name = `photo_${coverPic}_${req.session.user.username}_${Date.now()}.${ext}`
    uploadPath = path.join('.', process.env.FILE_UPLOAD_PATH, coverPic, file.name)

    // console.log(req.session)

    await file.mv(uploadPath, async function (err) {
        if (err)
            console.log(err)
        return new ErrResponse(err, 404);

        console.log('User photo was update...'.green.bgCyan)
    })

    // const picPath = `/${uploads}/${coverPic}/${file.name}`
    const picPath = path.join('/', uploads, coverPic, file.name)
    await User.findByIdAndUpdate(req.session.user._id, {coverPic: picPath}, {new: true})
        .exec()
        .then(result => {
            // Update user session data
            req.session.user = result

            // Send response
            res
                .status(200)
                .json({success: true, data: file.name});
        })
        .catch(err => new ErrResponse(err, 404))

    // console.log('ApiProfilePicture', req.files); // the uploaded file object
};