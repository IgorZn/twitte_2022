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





