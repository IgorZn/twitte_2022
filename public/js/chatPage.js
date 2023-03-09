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
        setTimeout(() => {
            $("#chatName").text(getChatName(data))
        }, 200)

    })
})

$(".sendMessageButton").click(() => {
    messageSubmitted()
})

$(".inputTextBox").keydown((event) => {
    if (event.which === 13) {
        messageSubmitted()
        return false // prevent to do anything further, no new line
    }
})


function messageSubmitted() {
    const content = $(".inputTextBox").val().trim()
    if (content) {
        sendMessage(content)
    }
    $(".inputTextBox").val("")

}

function sendMessage(content) {
    $.ajax({
        url: `/api/v1/messages/`,
        type: "POST",
        data: {content, chatId},
        success: (data, status, xhr) => {
            setTimeout(() => {
                console.log(data.data)
                addChatMessageHtml(data)
            }, 200)

        }
    })

}

function addChatMessageHtml(message) {
    if (!message.data.content || !message.data._id) {
        return alert('Message is not valid')
    }

    const messageDiv = createMessageHtml(message.data);
    $(".chatMessages").append(messageDiv)
}

function createMessageHtml(message) {
    const isMine = message.sender._id === userLoggedJs._id
    const liClassName = isMine ? "mine" : "theirs"; // to indicate as my message ot not (style and so on)

    return `<li class='message ${liClassName}'>
                <div class='messageContainer'>
                    <span class='messageBody'>
                        ${message.content}
                    </span>
                </div>
            </li>`;
}

