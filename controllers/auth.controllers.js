// @desc        Login user
// @route       POST /login
// @access      Public
exports.loginUser = async (req, res, next) => {
    res
        .status(200)
        .render("login", {title: 'Login page'})
};


// @desc        Register user
// @route       GET /register
// @access      Public
exports.getRegisterPage = async (req, res, next) => {
    res
        .status(200)
        .render("register", {title: 'Register page'})
};


// @desc        Register user
// @route       POST /register
// @access      Public
exports.registerUser = async (req, res, next) => {
    const {first_name, last_name, email, user_name, password} = req.body
    const toTrim = [first_name, last_name, email, user_name, password]
    const trimmed = []
    toTrim.forEach(el => {
        if (el) trimmed.push(el.trim())
    })

    // All fields are present
    if (trimmed.length === 5) {

    } else {

        res
            .status(200)
            .render("register", )
    }

    console.log(req.body)
    console.log(trimmed)


};