// @desc        Login user
// @route       POST /login
// @access      Public
exports.loginUser = async (req, res, next) => {
    res
        .status(200)
        .render("login", {title: 'Login page'})
};


// @desc        Register user
// @route       POST /register
// @access      Public
exports.registerUser = async (req, res, next) => {
    res
        .status(200)
        .render("register", {title: 'Register page'})
};