$(document).ready(() => {
    /*
    * 'postID' comes from 'postPage' (postPage.routes.js)
    *  controller where we put that into 'payload' and
    *  then set it as a variable in 'postPage.pug'
    *  ('script' section)
    * */
    $.get("/api/v1/posts/" + postId, results => {
        console.log(results)
        outputPosts(results.data, $(".postContainer"))
    })
})
