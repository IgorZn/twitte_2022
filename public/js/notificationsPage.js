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
    return `<a href='#' class='resultListItem notification'>
                <div class='resultsImageContainer'>
                    <img src='${userFrom.profilePic}'>
                </div>
                <div class='resultsDetailsContainer ellipsis'>
                    <span class='ellipsis'>This is the text</span>
                </div>
            </a>`;
}