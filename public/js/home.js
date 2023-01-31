$(document).ready(() => {
    $.get("/api/v1/posts", { followingOnly: true }, results => {
        console.log(results)
        outputPosts(results.data, $(".postContainer"))
    })
})
