
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

