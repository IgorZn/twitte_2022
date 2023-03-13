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

    });

    // Chat messages
    $.get(`/api/v1/chats/${chatId}/messages`, (data) => {
        setTimeout(() => {
            // console.log(data.data)
            const messages = []
            let lastSenderId = ""

            data.data.forEach((message, index) => {
                const html = createMessageHtml(message, data.data[index + 1], lastSenderId)
                messages.push(html)
                lastSenderId = message.sender._id
            })

            // make one big string
            const messagesHtml = messages.join("")
            addMessagesHtmlToPage(messagesHtml)

        }, 100)

    });
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

function addMessagesHtmlToPage(html) {
    $(".chatMessages").append(html)

    // TODO: scroll to bottom
}

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
                // console.log('sendMessage>>>', data.data, status)
                if(status != 'success') {
                    return alert('Internal error')
                }
                addChatMessageHtml(data)
            }, 200)

        }
    })

}

function addChatMessageHtml(message) {
    if (!message.data.content || !message.data._id) {
        return alert('Message is not valid')
    }

    const messageDiv = createMessageHtml(message.data, null, "");
    $(".chatMessages").append(messageDiv)
}

function createMessageHtml(message, nextMessage, lastSenderId) {
    const isMine = message.sender._id === userLoggedJs._id
    let liClassName = isMine ? "mine" : "theirs"; // to indicate as my message ot not (style and so on)

    const sender = message.sender
    const senderName = `${sender.firstName} ${sender.lastName}`
    const currentSenderId = sender._id
    const nextSenderId = nextMessage != null ? nextMessage.sender._id : ""

    /*
    * if last person 'message.sender._id' not eq 'currentSenderId'
    * 'currentSenderId' -- who send this message
    * */
    const isFirst = lastSenderId == currentSenderId
    const isLast = nextSenderId != userLoggedJs._id

    if(isFirst){
        liClassName += " first"
    }

    if(isLast){
        liClassName += " last"
    }


    return `<li class='message ${liClassName}'>
                <div class='messageContainer'>
                    <span class='messageBody'>
                        ${message.content}
                    </span>
                </div>
            </li>`;
}

