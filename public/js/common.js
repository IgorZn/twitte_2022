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
        let html = createPostHTML(postData)
        $(".postContainer").prepend(html)
        textbox.val("")
        button.prop("disable", true)
    })
})

function createPostHTML(postData) {
    console.log(postData)
    const createdAt = postData.data.createdAt
    const postedBy = postData.data.postedBy
    const displayName = postedBy.firstName + postedBy.lastName
    return `<div class='post'>
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
                            <span>${postData.data.content}</span>
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
                                <button>
                                    <i class='far fa-heart'></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
}