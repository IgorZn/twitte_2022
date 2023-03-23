$(document).ready(() => {
    $.get("/api/v1/notifications", results => {
        console.log(results)
    })
})