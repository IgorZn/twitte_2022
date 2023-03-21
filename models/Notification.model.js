const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    userTo: {
        type: 'ObjectId',
        ref: 'User'
    },
    userFrom: {
        type: 'ObjectId',
        ref: 'User'
    },
    notificationType: String,
    opened: {
        type: Boolean,
        default: false
    },
    entityId: 'ObjectId'
}, {
    timestamps: true
});


NotificationSchema.static({
    insertNotification: async function (userTo, userFrom, notificationType, entityId) {
        const data = {
            userTo: userTo,
            userFrom: userFrom,
            notificationType: notificationType,
            entityId: entityId
        };
        await this.deleteOne(data).catch(error => console.log(error));
        return this.create(data).catch(error => console.log(error));

    }
})

module.exports = mongoose.model('Notification', NotificationSchema);
