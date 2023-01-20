$(document).ready(() => {
    loadPost()
})

function loadPost() {
    $.ajax({
        url: "/api/v1/posts",
        type: "GET",
        data: { postedBy: profileUserId },
        success: results => {
            console.log(results)
            outputPosts(results.data, $(".postContainer"))
        },
    })

}