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

    // Pinned post
    delete data.isReply
    data.pinned = true
    $.ajax({
        url: "/api/v1/posts",
        type: "GET",
        data,
        success: results => {
            console.log(results)
            outputPinnedPost(results.data, $(".pinnedPostContainer"))
        },
    })

}

function outputPinnedPost(results, container) {
    if (results.length == 0) {
        container.hide()
        return
    }

    container.html("");

    results.forEach(result => {
        const html = createPostHTML(result)
        container.append(html);
    });
}