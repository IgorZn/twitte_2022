$("#postTextarea, #replayTextarea").keyup(event => {
    let textbox = $(event.target);
    let value = textbox.val().trim();
    let isModal = textbox.parents(".modal").length == 1;
    let submitButton = isModal ? $("#submitReplayButton") : $("#submitPostButton");

    if (submitButton.length == 0) return alert("No submit button found");

    if (value == "") {
        submitButton.prop("disabled", true);
        return;
    }

    submitButton.prop("disabled", false);
})

$("#submitPostButton").click(() => {
    let button = $(event.target);
    let textbox = $("#postTextarea");

    let data = {
        content: textbox.val()
    }

    $.post("/api/v1/posts", data, postData => {
        console.log('to >> createPostHTML', postData)
        let html = createPostHTML(postData.data)
        $(".postContainer").prepend(html)
        textbox.val("")
        button.prop("disable", true)
    })
})

$("#replayModal").on("show.bs.modal", (event) => {
    let button = $(event.relatedTarget);
    let postId = getPostIdFromElement(button);

    $.get("/api/v1/posts/" + postId, results => {
        console.log("show.bs.modal", results)
        outputPosts(results.data, $("#originalPostContainer"))
    })
})

$("#replayModal").on("hidden.bs.modal", (event) => {
    $("#originalPostContainer").html("")
})

$(document).on("click", ".likeButton", (event) => {
    let button = $(event.target);
    let postId = getPostIdFromElement(button);

    if (postId === undefined) return;

    $.ajax({
        url: `/api/v1/posts/${postId}/like`,
        type: "PUT",
        success: (postData) => {
            button.find("span").text(postData.likes || "");
            if (postData.data.likes.includes(userLoggedJs._id)) {
                button.addClass("active")
            } else {
                button.removeClass("active")
            }
        }
    })

})

$(document).on("click", ".retweetButton", (event) => {
    let button = $(event.target);
    let postId = getPostIdFromElement(button);

    if (postId === undefined) return;

    $.ajax({
        url: `/api/v1/posts/${postId}/retweet`,
        type: "POST",
        success: (postData) => {
            console.log(postData)
            button.find("span").text(postData.data.retweetUsers.length || "");
            if (postData.data.retweetUsers.includes(userLoggedJs._id)) {
                button.addClass("active")
            } else {
                button.removeClass("active")
            }
        }
    })

})

// -------

function getPostIdFromElement(element) {
    const isRoot = element.hasClass("post");
    const rootElement = isRoot == true ? element : element.closest(".post");
    const postId = rootElement.data().id;
    /*
    *  rootElement.data().id
    *  ??.??. ?? ?????? <div class='post' data-id='${dataId}'
    *  .data() -- ???????????? ?? ?????????????? ??????, ?????? ?? data-<?????? ????????????>=<??????????-???? ????????????????>
    *  ?? ???????????? ????????????, ???????????????? ??????:
    *  {bar: 'some-bar-value', id: '63a2b44e595c4b1620ba4767'}
    * */

    if (postId === undefined) return alert("Post id undefined");

    return postId
}


function createPostHTML(postData) {
    console.log('just come -postData-', postData)
    if (!postData) return alert('Postdata is NULL')
    const isRetweet = postData.retweetData !== undefined;
    console.log('isRetweet>>', isRetweet)
    // who's that retweet
    const retweetedBy = isRetweet ? postData.postedBy.username : null
    /*
    *  ???????????????? postData ???? ???????????????????? postData.retweetData ???????? ??????
    *  ????????????
    */
    postData = isRetweet ? postData.retweetData : postData

    // console.log(retweetedBy)
    // console.log('before createdAt -createdAt-', postData)

    let retweetText = '';
    if (isRetweet) {
        retweetText = `<span>
                        <i class='fas fa-retweet'></i>
                        Retweeted by <a href='/profile/${retweetedBy}'>@${retweetedBy}</a>    
                    </span>`
    }

    const createdAt = timeDifference(new Date(), new Date(postData.createdAt))
    const postedBy = postData.postedBy
    const dataId = postData._id
    const displayName = postedBy.firstName + ' ' + postedBy.lastName
    const likeButtonActiveClass = postData.likes.includes(userLoggedJs._id) ? "active" : "";
    const retweetButtonActiveClass = postData.retweetUsers.includes(userLoggedJs._id) ? "active" : "";
    return `<div class='post' data-id='${dataId}' data-bar="some-bar-value">
                <div class="postActionContainer">
                    ${retweetText}
                </div>
                <div class='mainContentContainer'>
                    <div class='userImageContainer'>
                        <img src='${postedBy.profilePic}'>
                    </div>
                    <div class='postContentContainer'>
                        <div class='header'>
                            <a href='/profile/${postedBy.username}'>${displayName}</a>
                            <span class='username'>@${postedBy.username}</span>
                            <span class='date'>${createdAt}</span>
                        </div>
                        <div class='postBody'>
                            <span>${postData.content}</span>
                        </div>
                        <div class='postFooter'>
                            <div class='postButtonContainer'>
                                <button type="button" data-toggle="modal" data-target="#replayModal">
                                    <i class='far fa-comment'></i>
                                </button>
                            </div>
                            <div class='postButtonContainer green'>
                                <button class="retweetButton ${retweetButtonActiveClass}">
                                    <i class='fas fa-retweet'></i>
                                    <span>${postData.retweetUsers.length || ""}</span>
                                </button>
                            </div>
                            <div class='postButtonContainer red'>
                                <button  class='likeButton ${likeButtonActiveClass}'>
                                    <i class='far fa-heart'></i>
                                    <span>${postData.likes.length || ""}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
}


function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if (elapsed / 1000 < 30) return "Just now";

        return Math.round(elapsed / 1000) + ' seconds ago';
    } else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' minutes ago';
    } else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + ' hours ago';
    } else if (elapsed < msPerMonth) {
        return Math.round(elapsed / msPerDay) + ' days ago';
    } else if (elapsed < msPerYear) {
        return Math.round(elapsed / msPerMonth) + ' months ago';
    } else {
        return Math.round(elapsed / msPerYear) + ' years ago';
    }
}


function outputPosts(results, container) {
    container.html("");

    // convert to an array if not
    if(!Array.isArray(results)){
        results = [results]
    }

    results.forEach(result => {
        const html = createPostHTML(result)
        container.append(html);
    });

    if (results.length == 0) {
        container.append("<span class='noResults'>Nothing to show.</span>")
    }
}