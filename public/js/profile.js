$(document).ready(() => {
    loadPost()
})

const data = {
    postedBy: profileUserId,
    isReply: true
}

function loadPost() {
    $.ajax({
        url: "/api/v1/posts",
        type: "GET",
        data,
        success: results => {
            console.log(results)
            outputPosts(results.data, $(".postContainer"))
        },
    })

}