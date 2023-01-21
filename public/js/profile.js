$(document).ready(() => {
    const data = {
        postedBy: profileUserId,
        isReply: selectedTab.includes("replies")
    }

    loadPost(data)
})


function loadPost(data) {
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