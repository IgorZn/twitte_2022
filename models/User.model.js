const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    fullName: {
        type: String
    },
    username: {
        type: String, required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        select: false,
        required: true
    },
    profilePic: {
        type: String,
        default: "/images/profilePic.jpeg"
    },
    coverPic: {
        type: String,
    },
    likes: [{type: 'ObjectId', ref: 'Post'}], // ПОСТЫ, понравившиеся  ПОЛЬЗОВАТЕЛЮ
    retweets: [{type: 'ObjectId', ref: 'Post'}], // ПОСТЫ, которые ретвитнули
    following: [{type: 'ObjectId', ref: 'User'}],
    followers: [{type: 'ObjectId', ref: 'User'}],

}, {
    virtuals: {
        getFullName: {
            get() {
                return this.firstName + ' ' + this.lastName;
            }
        }
    },
    timestamps: true
});

UserSchema.pre('save', async function (next) {
    // Если мы НЕ изменяем 'password', то идем просто дальше...
    if (!this.isModified('password')) {
        next();
    }

    // Run below ONLY if we're modifying PASSWORD field
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

const isFollowing = (user, currentLoggedInUser) => {
    return currentLoggedInUser.following && currentLoggedInUser.following.includes(user._id.toString())
}
UserSchema.static({
    matchPassword: async function (plainTextPassword, hashedPassword) {
        return await bcrypt.compare(plainTextPassword, hashedPassword)
            .then(function (result) {
                return result
            })
    },
    getPayload: async function (username, userLoggedIn) {
        const isThisID = mongoose.isValidObjectId(username)
        // console.log('username, userLoggedIn >>', isThisID, username, userLoggedIn)
        if (isThisID) {
            // if username as ID
            return this.model('User')
                .findById(username)
                .exec()
                .then(user => {
                    return {
                        title: user.username,
                        user: user,
                        userLoggedJs: JSON.stringify(userLoggedIn),
                        profileUser: user,
                        isLoggedInUserFollower: isFollowing(user, userLoggedIn),
                        status: true
                    }
                })
        } else {
            // by username
            return this.model('User')
                .findOne({username})
                .exec()
                .then(user => {
                    if (user) {
                        return {
                            title: user.username,
                            user: user,
                            userLoggedJs: JSON.stringify(userLoggedIn),
                            isLoggedInUserFollower: isFollowing(user, userLoggedIn),
                            profileUser: user,
                            status: true
                        }
                    }

                    return {
                        title: "User not found",
                        status: false
                    }
                })
        }

    },
    getFullUserName: async function (userObj) {
        // console.log('getFullUserName>>>', `${userObj.firstName} ${userObj.lastName}`)
        return `${userObj.firstName} ${userObj.lastName}`
    }
})

module.exports = mongoose.model('User', UserSchema);