$(document).ready(() => {
    $.get("/api/v1/posts", results => {
        console.log(results)
        outputPosts(results.data, $(".postContainer"))
    })
})


