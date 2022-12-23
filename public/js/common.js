$("#postTextarea").keyup(event => {
    let textbox = $(event.target);
    let value = textbox.val().trim();
    let submitButton = $("#submitPostButton");

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
        let html = createPostHTML(postData.data)
        $(".postContainer").prepend(html)
        textbox.val("")
        button.prop("disable", true)
    })
})


$(document).on("click", ".likeButton", (event) => {
    let button = $(event.target);
    let postId = getPostIdFromElement(button);
    console.log(postId);
})


function getPostIdFromElement(element) {
    const isRoot = element.hasClass("post");
    const rootElement = isRoot == true ? element : element.closest(".post");
    const postId = rootElement.data().id;
    /*
    *  rootElement.data().id
    *  т.к. у нас <div class='post' data-id='${dataId}'
    *  .data() -- пойдет и соберет всё, что с data-<что угодно>=<какое-то значение>
    *  и вернут объект, например так:
    *  {bar: 'some-bar-value', id: '63a2b44e595c4b1620ba4767'}
    * */

    if (postId === undefined) return alert("Post id undefined");


    $.ajax({
        url: `/api/v1/posts/${postId}/like`,
        type: "PUT",
        success: (postData) => {
            console.log(postData);
        }
    })
}


function createPostHTML(postData) {
    const createdAt = timeDifference(new Date(), new Date(postData.createdAt))
    const postedBy = postData.postedBy
    const dataId = postData._id
    const displayName = postedBy.firstName + ' ' + postedBy.lastName
    return `<div class='post' data-id='${dataId}' data-bar="some-bar-value">
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
                                <button>
                                    <i class='far fa-comment'></i>
                                </button>
                            </div>
                            <div class='postButtonContainer'>
                                <button>
                                    <i class='fas fa-retweet'></i>
                                </button>
                            </div>
                            <div class='postButtonContainer'>
                                <button  class='likeButton'>
                                    <i class='far fa-heart'></i>
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