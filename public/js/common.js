// Globals
let cropper
let timer, value;
let selectedUsers = [];


// -- On Event

$(document).ready(() => {
    refreshMessagesBadge()
    refreshNotificationsBadge()
})

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

$("#submitPostButton, #submitReplayButton").click(() => {
    let button = $(event.target);

    let isModal = button.parents(".modal").length == 1;
    let textbox = isModal ? $("#replayTextarea") : $("#postTextarea")

    let data = {
        content: textbox.val()
    }

    if (isModal) {
        let postID = button.data().id
        if (!postID) return alert("ID is null");
        data.replyTo = postID;
    }

    $.post("/api/v1/posts", data, postData => {
        if (postData.data.replyTo) {
            // TODO: console.log(postData.data.replyTo.postedBy)
            // NEED to fix it
            emitNotification(postData.data.replyTo.postedBy)
            location.reload()
        } else {
            // console.log('to >> createPostHTML', postData)
            let html = createPostHTML(postData.data)
            $(".postContainer").prepend(html)
            textbox.val("")
            button.prop("disable", true)
        }

    })
})

$("#replayModal").on("show.bs.modal", (event) => {
    let button = $(event.relatedTarget);
    let postId = getPostIdFromElement(button);
    $("#submitReplayButton").data("id", postId);

    $.get("/api/v1/posts/" + postId, results => {
        console.log("show.bs.modal", results)
        outputPosts(results.data, $("#originalPostContainer"))
    })
})

$("#deletePostModal").on("show.bs.modal", (event) => {
    let button = $(event.relatedTarget);
    let postId = getPostIdFromElement(button);
    $("#deletePostButton").data("id", postId);
})

$("#confirmPinModal").on("show.bs.modal", (event) => {
    let button = $(event.relatedTarget);
    let postId = getPostIdFromElement(button);
    $("#pinPostButton").data("id", postId);
})

$("#unpinModal").on("show.bs.modal", (event) => {
    let button = $(event.relatedTarget);
    let postId = getPostIdFromElement(button);
    $("#unPinPostButton").data("id", postId);
})

$("#deletePostButton").click((event) => {
    const postID = $(event.target).data("id")
    $.ajax({
        url: `/api/v1/posts/${postID}`,
        type: "DELETE",
        success: (data, status, xhr) => {
            location.reload()
            console.log(data)
        }
    })
})

$("#pinPostButton").click((event) => {
    const postID = $(event.target).data("id")
    $.ajax({
        url: `/api/v1/posts/${postID}`,
        type: "PUT",
        data: {pinned: true},
        success: (data, status, xhr) => {
            console.log(data.data)
            setTimeout(() => location.reload(), 200)

        }
    })
})

$("#unPinPostButton").click((event) => {
    const postID = $(event.target).data("id")
    $.ajax({
        url: `/api/v1/posts/${postID}`,
        type: "PUT",
        data: {pinned: false},
        success: (data, status, xhr) => {
            console.log(data.data)
            setTimeout(() => location.reload(), 200)

        }
    })
})

$("#replayModal").on("hidden.bs.modal", (event) => {
    $("#originalPostContainer").html("")
})

$("#createChatButton").click((event) => {
    const usersData = JSON.stringify(selectedUsers);

    $.ajax({
        url: '/api/v1/chats',
        type: "POST",
        data: {users: usersData},
        success: (data, status, xhr) => {
            setTimeout(() => console.log(data.data, status, xhr.status), 500)
            location.href = `/messages/${data.data._id}`

        }
    })
})

$(document).on("click", ".notification.active", (e) => {
    const container = $(e.target);
    const notificationId = container.data().id

    const href = container.attr("href")
    e.preventDefault() // prevent normal behaviour to happening

    const callback = () => window.location = href;
    markNotificationAsOpened(notificationId, callback);
})

$(document).on("click", "#markNotificationsAsRead", () => markNotificationAsOpened())

// -- Document

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
                emitNotification(postData.data.postedBy)
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
                emitNotification(postData.data.postedBy)
            } else {
                button.removeClass("active")
            }
        }
    })

})

$(document).on("click", ".post", (event) => {
    let element = $(event.target);
    let postID = getPostIdFromElement(element);

    if (postID && !element.is("button")) {
        window.location.href = '/post/' + postID
    }

})

$(document).on("click", ".followButton", (event) => {
    const button = $(event.target);
    const userId = button.data().user;

    $.ajax({
        url: `/api/v1/users/${userId}/follow`,
        type: "PUT",
        success: (result, status, xhr) => {
            const data = result.data
            console.log(result.data)
            if (xhr.status == 404) {
                console.log('User not found')
                return
            }

            let diffFoll = 1
            if (data.following && data.following.includes(userId)) {
                button.addClass("following")
                button.text("Following")
                emitNotification(userId)
            } else {
                button.removeClass("following")
                button.text("Follow")
                diffFoll = -1
            }

            let followersLabel = $('#followersValue')
            if (followersLabel.length) {
                let followersText = followersLabel.text()
                followersLabel.text(parseInt(followersText) + diffFoll)
            }
        }
    })

})


// -- JS


// -- Function

function uploadImage(event) {
    const URLS = {
        imageUploadButton: "/api/v1/users/profilePicture",
        coverUploadModal: "/api/v1/users/profileCoverImage"
    }
    const key = event.target.getAttribute("id")

    const canvas = cropper.getCroppedCanvas()
    if (!canvas) {
        alert('Could not upload image')
        return;
    }

    canvas.toBlob((blob) => {
        const formData = new FormData();
        formData.append("croppedImage", blob)

        const options = {
            method: 'POST',
            body: formData
        }

        fetch(URLS[key], options)
            .then(res => {
                if (res.ok) {
                    location.reload()
                }
                console.log(res)
            })
    })
}


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

    return postId
}


function createPostHTML(postData, largeFont = false) {
    // console.log('just come -postData-', postData)
    if (!postData) return location.href = '/login'
    const isRetweet = postData.retweetData !== undefined;
    // console.log('isRetweet>>', isRetweet)
    // who's that retweet
    const retweetedBy = isRetweet ? postData.postedBy.username : null
    /*
    *  Обновить postData на содержимое postData.retweetData если это
    *  ретвит
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

    let replyFlag = "";
    if (postData.replyTo && postData.replyTo._id) {
        checkPopulate(postData)
        let replyToUser = postData.replyTo.postedBy.username
        replyFlag = `<div class='replyFlag'>
                        Replying to <a href='/profile/${replyToUser}'>@${replyToUser}<a>
                    </div>`;
    }

    const createdAt = timeDifference(new Date(), new Date(postData.createdAt))
    const postedBy = postData.postedBy
    const dataId = postData._id
    const displayName = postedBy.firstName + ' ' + postedBy.lastName
    const likeButtonActiveClass = postData.likes.includes(userLoggedJs._id) ? "active" : "";
    const retweetButtonActiveClass = postData.retweetUsers.includes(userLoggedJs._id) ? "active" : "";
    const largeFontClass = largeFont ? "largeFont" : "";

    let buttons = "";
    let pinnedPostText = "";
    if (postData.postedBy._id == userLoggedJs._id) {
        let pinnedClass = "";
        let dataTarget = "#confirmPinModal";
        if (postData.pinned === true) {
            pinnedClass = "active";
            dataTarget = "#unpinModal";
            pinnedPostText = "<i class='fas fa-thumbtack'></i><span>Pinned post</span>"
        }

        buttons = `<button class="pinButton ${pinnedClass}" data-id="${postData._id}" data-toggle="modal" data-target="${dataTarget}">
                    <i class="fas fa-light fa-thumbtack"></i></button>
                <button data-id="${postData._id}" data-toggle="modal" data-target="#deletePostModal">
                    <i class='fas fa-times'></i></button>`;
    }

    return `<div class='post ${largeFontClass}' data-id='${dataId}' data-bar="some-bar-value">
                <div class="postActionContainer">
                    ${retweetText}
                </div>
                <div class='mainContentContainer'>
                    <div class='userImageContainer'>
                        <img src='${postedBy.profilePic}'>
                    </div>
                    <div class='postContentContainer'>
                    <div class="pinnedPostText">${pinnedPostText}</div>
                        <div class='header'>
                            <a href='/profile/${postedBy.username}'>${displayName}</a>
                            <span class='username'>@${postedBy.username}</span>
                            <span class='date'>${createdAt}</span>
                            ${buttons}
                        </div>
                        ${replyFlag}
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
    if (!Array.isArray(results)) {
        results = [results]
    }

    results.forEach(result => {
        if (!result.pinned) {
            const html = createPostHTML(result)
            container.append(html);
        }
    });

    if (results.length == 0) {
        container.append("<span class='noResults'>Nothing to show.</span>")
    }
}


function checkPopulate(data) {
    if (!data.replyTo._id) {
        return alert('Reply to is not populated');
    }

    if (!data.replyTo.postedBy._id) {
        return alert('Posted by is not populated');
    }
}


function outPutWithReplies(results, container) {
    container.html("");

    if (Object.keys(results.data).includes('replyTo')) {
        const html = createPostHTML(results.data.replyTo)
        container.append(html);
    }

    const mainPostHtml = createPostHTML(results.data, true)
    container.append(mainPostHtml);

    if (Object.keys(results).includes('replies')) {
        results.replies.forEach(result => {
            const html = createPostHTML(result)
            container.append(html);
        });
    }

}


function outputUser(results, container) {
    container.html("")
    if (results.length) {
        results.forEach(result => {
            const html = createUserHtml(result, true)
            container.append(html)
            // console.log(result.firstName)
        })
    } else {
        container.append("<span class='noResults'>No results found</span>")
    }

}


function createUserHtml(userData, showFollowButton) {
    const name = userData.firstName + " " + userData.lastName;

    let followButton = "";
    let isFollowing = userLoggedJs.following && userLoggedJs.following.includes(userData._id);
    let text = isFollowing ? "Following" : "Follow"
    let buttonClass = isFollowing ? "followButton following" : "followButton"


    if (showFollowButton && userLoggedJs._id != id) {
        followButton = `<div class='followButtonContainer'>
                            <button class='${buttonClass}' data-user='${id}'>${text}</button>
                        </div>`;
    }


    return `<div class='user'>
                <div class='userImageContainer'>
                    <img src='${userData.profilePic}'>
                </div>
                <div class='userDetailsContainer'>
                    <div class='header'>
                        <a href='/profile/${userData.username}'>${name}</a>
                        <span class='username'>@${userData.username}</span>
                    </div>
                </div>
                ${followButton}
            </div>`;
}


function makeSearchUsers(searchTerm) {
    let url = "/api/v1/users?";

    const options = {
        method: 'GET',
    }
    // https://stackoverflow.com/a/58437909/6671330

    fetch(url + new URLSearchParams({search: searchTerm}), options)
        .then(res => {
            // this 'res.json()' will go the next 'then' below as a result (data)
            return res.json()
                .then(json => {
                    return json
                })
        })
        .then(data => {
            console.log(data)
            // show search results
            outputSelectableUsers(data.data, $(".resultsContainer"))

        })
}


function outputSelectableUsers(results, container) {
    container.html("")
    if (results.length > 0) {
        results.forEach(result => {
            // skip in output himself
            if (result._id == userLoggedJs._id || selectedUsers.some(u => u._id == result._id)) {
                /*
                *  if user (result) already exist in an array and
                *  check that selectedUsers don't contain current user (result)
                *
                *  короче, эта штука просто фильтрует вывод на странице, чтобы там
                *  не было, того кого уже добавили в selectedUsers
                * */
                return;
            }

            const html = createUserHtml(result, true)
            const element = $(html);
            element.click(() => userSelected(result))

            container.append(element)
            // console.log(result.firstName)
        })
    } else {
        container.append("<span class='noResults'>No results found</span>")
    }
}


function userSelected(user) {
    selectedUsers.push(user)
    updateSelectedUsersHtml()
    $("#userSearchTextBox").val("").focus();
    $(".resultsContainer").html("");
    $("#createChatButton").prop("disabled", false)
}


function updateSelectedUsersHtml() {
    const elements = []
    console.log(selectedUsers)

    selectedUsers.forEach(userObj => {
        const name = `${userObj.firstName} ${userObj.lastName}`
        const userElement = $(`<span class='selectedUser'>${name}</span>`)
        console.log(userElement)
        elements.push(userElement)
    })

    $(".selectedUser").remove();
    $("#selectedUsers").prepend(elements)
}


function messageReceived(newMessage) {
    if ($(".chatContainer").length == 0) {
        // we are NOT on the chat page
        // TODO: popup

    } else {
        // we are ON the chat page
        addChatMessageHtml(newMessage)
    }

    refreshMessagesBadge()
}


function markNotificationAsOpened(notificationId = null, callback = null) {
    if (!callback) callback = () => location.reload()

    const singleURL = `/api/v1/notifications/${notificationId}/markAsOpened`
    const markAllURL = '/api/v1/notifications/markAsOpened'
    const URL = notificationId != null ? singleURL : markAllURL

    $.ajax({
        url: URL,
        type: "PUT",
        success: (data, status, xhr) => callback()
    })
}


function refreshMessagesBadge() {
    $.get('api/v1/chats', {unreadOnly: true}, data => {
        console.log("refreshMessagesBadge>>>", data.data.length)
        const numResults = data.data.length

        if(numResults){
            $("#messagesBadge").text(numResults).addClass("active")
        } else {
            $("#messagesBadge").text("").removeClass("active")
        }

    })

}


function refreshNotificationsBadge() {
    $.get('api/v1/notifications', {unreadOnly: true}, data => {
        console.log("refreshNotificationsBadge>>>", data.data.length)
        const numResults = data.data.length

        if(numResults){
            $("#notificationBadge").text(numResults).addClass("active")
        } else {
            $("#notificationBadge").text("").removeClass("active")
        }

    })

}


function showNotificationPopup(data) {
    const html = createNotificationHtml(data)
    const element = $(html)
    element.prependTo("#notificationList")

    setTimeout(() => element.fadeOut(400), 2000)
}