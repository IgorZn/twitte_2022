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
            // outputPosts(results.data, $(".resultContainer"))
        },
    })

}