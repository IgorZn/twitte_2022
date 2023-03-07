
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

$(".sendMessageButton").click(() => {
    messageSubmitted()
})

$(".inputTextBox").keydown((event) => {
    if(event.which === 13) {
        messageSubmitted()
        return false // prevent to do anything further, no new line
    }
})


function messageSubmitted() {
    console.log('messageSubmitted')
}


