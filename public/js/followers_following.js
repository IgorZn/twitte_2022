$(document).ready(() => {
    console.log('start loadFF()')
    loadFF()
})


function loadFF() {
    /*
    *   selectedTab -- comes from 'followers_and_following.pug' and it contain value
    *   'following' or 'followers' and 'selectedTab' in 'followers_and_following.pug'
    *   comes from 'profileFollowing' or 'profileFollowers' controllers
    *
    * */

    $.ajax({
        url: `/api/v1/users/${id}/${selectedTab}`,
        type: "GET",
        success: results => {
            console.log(results)
            if (selectedTab.includes('followers')) {
                outputUser(results.data.followers, $(".resultsContainer"))
            } else {
                outputUser(results.data.following, $(".resultsContainer"))
            }
            // outputPosts(results.data, $(".resultsContainer"))
        },
    })

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