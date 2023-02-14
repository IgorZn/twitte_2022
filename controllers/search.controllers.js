const getSearchPayload = (args={}) => {
    const { title, userId, user} = args
    return {
        title: title || "Search",
        userId,
        user,
        userLoggedJs: JSON.stringify(user)
    }
}


// @desc        Search page
// @route       GET /
// @access      Public
exports.search = async (req, res, next) => {
    const user = req.session.user
    const userId = req.session.user._id.toString()
    const id = userId

    const payload = getSearchPayload({userId, user, userLoggedJs: user})
    payload.selectedTab = "posts"
    payload.id = id

    res.render('searchPage', payload);
};


// @desc        Search page
// @route       GET /:selectedTab
// @access      Public
exports.searchSelectedTab = async (req, res, next) => {
    const user = req.session.user
    const userId = req.session.user._id.toString()

    const payload = getSearchPayload({userId, user, userLoggedJs: user})
    payload.selectedTab = req.params.selectedTab

    res.render('searchPage', payload);
};