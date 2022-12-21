$(document).ready(() => {
    $.get("/api/v1/posts", results => {
        console.log(results)
        outputPosts(results.data, $(".postContainer"))
    })
})


function outputPosts(results, container) {
    container.html("");

    results.forEach(result => {
        const html = createPostHTML(result)
        container.append(html);
    });

    if (results.length == 0) {
        container.append("<span class='noResults'>Nothing to show.</span>")
    }
}