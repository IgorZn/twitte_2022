// @desc        Login user
// @route       POST /login
// @access      Public
exports.loginUser = async (req, res, next) => {
    res
        .status(200)
        .render("login", {title: 'Login page'})
};