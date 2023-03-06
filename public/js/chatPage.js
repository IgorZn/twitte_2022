
$("#chatNameButton").click((event) => {
    const name = $("#chatNameTextbox").val().trim()
    console.log(name)

    $.ajax({
        url: `/api/v1/chats/${chatId}`,
        type: "PUT",
        data: {chatName: name},
        success: (data, status, xhr) => {

            setTimeout(() => {
                location.reload()
                console.log(data.data)
            }, 200)

        }
    })
})

$(document).ready(() => {
    // Update chat name
    $.get(`/api/v1/chats/${chatId}`, (data) => {
        console.log(data)
        setTimeout(()=> {
            $("#chatName").text(getChatName(data))
        }, 200)

    })
})


