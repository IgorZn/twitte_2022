$(document).ready(() => {
    const data = {
        postedBy: profileUserId,
        isReply: selectedTab.includes("replies")
    }

    loadPost(data)
})

document
    .getElementById("filePhoto")
    .addEventListener('change', (event) => {
        const reader = new FileReader();
        const input = $(event.target)[0];
        reader.onload = (e) => {
            const image = document.getElementById("imagePreview")
            image.src = e.target.result

            if (cropper) {
                cropper.destroy()
            }

            cropper = new Cropper(image, {
                aspectRatio: 1 / 1,
                background: false,
            });

        }

        reader.readAsDataURL(...input.files)

    })

document
    .getElementById("fileCoverPhoto")
    .addEventListener('change', (event) => {
        const reader = new FileReader();
        const input = $(event.target)[0];
        reader.onload = (e) => {
            const image = document.getElementById("imageCoverPreview")
            image.src = e.target.result

            if (cropper) {
                cropper.destroy()
            }

            cropper = new Cropper(image, {
                aspectRatio: 16 / 9,
                background: false,
            });

        }

        reader.readAsDataURL(...input.files)

    })

document
    .getElementById("imageUploadButton")
    .onclick = (event) => {
    uploadImage(event)}

document
    .getElementById("coverUploadModal")
    .onclick = (event) => {
    uploadImage(event)
}



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