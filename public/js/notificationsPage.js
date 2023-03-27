$(document).ready(() => {
    $.get("/api/v1/notifications", results => {
        console.log(results)
        outputNotificationList(results.data, $(".resultsContainer"))
    })
})

function outputNotificationList(notifications, container) {
    notifications.forEach( notification => {
        const html = createNotificationHtml(notification)
        container.append(html)
    })

    if(!notifications.length){
        container.append("<span class='noResults'>Nothing to show.</span>")
    }
}

function createNotificationHtml(notification) {
    const userFrom = notification.userFrom
    const text = getNotificationText(notification)
    const url = getNotificationUrl(notification)

    return `<a href=${url} class='resultListItem notification'>
                <div class='resultsImageContainer'>
                    <img src='${userFrom.profilePic}'>
                </div>
                <div class='resultsDetailsContainer ellipsis'>
                    <span class='ellipsis'>${text}</span>
                </div>
            </a>`;
}

function getNotificationText(notification) {
    const userForm = notification.userFrom
    if(!userForm.firstName || !userForm.lastName){
        return alert('User data is not populated')
    }

    const userFromName = `${userForm.firstName} ${userForm.lastName}`
    let text

    if(notification.notificationType == "retweet") {
        text = `${userFromName} retweeted one of your post`
    }
    if(notification.notificationType == "postLike") {
        text = `${userFromName} liked one of your post`
    }
    if(notification.notificationType == "reply") {
        text = `${userFromName} replied to you`
    }
    if(notification.notificationType == "follow") {
        text = `${userFromName} followed to you`
    }


    return `<span class=ellipsis>${text}</span>`

}

function getNotificationUrl(notification) {
    let url
    const RRR = ['retweet', 'postLike', 'reply'].some((el) => {
           return el === notification.notificationType
        })

    if(RRR) {
        url = `/post/${notification.entityId}`
    }

    if(notification.notificationType == "follow") {
        url = `/profile/${notification.userFrom._id}`
    }

    return url

}