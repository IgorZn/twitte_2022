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
        required: true
    },
    profilePic: {
        type: String,
        default: "/images/profilePic.png"
    },
},{
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

module.exports = mongoose.model('User', UserSchema);