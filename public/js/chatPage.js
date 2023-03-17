let typing = false;
let lastTypingTime, timerLenght;

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
    socket.emit("join room", chatId)
    socket.on("typing", () => {
        $(".typingDots").show()
    })
    socket.on("stop_typing", () => {
        $(".typingDots").hide()
    })



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
            scrollToBottom(false)
            $(".loadingSpinnerContainer").remove()
        }, 300)

    });
})

$(".sendMessageButton").click(() => {
    messageSubmitted()
})

$(".inputTextBox").keydown((event) => {
    updateTyping()


    if (event.which === 13) {
        messageSubmitted()
        return false // prevent to do anything further, no new line
    }
})

function updateTyping() {
    if(!connected) return
    if(!typing){
        typing = true
        socket.emit("typing", chatId)
    }

    lastTypingTime = new Date().getTime();
    timerLenght = 3000
    setTimeout(() => {
        let timeNow = new Date().getTime();
        let timeDiff = timeNow - lastTypingTime

        if(timeDiff >= timerLenght && typing){
            socket.emit("stop_typing", chatId);
            typing = false;
        }
    }, timerLenght)

}

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
                if (status != 'success') {
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
    scrollToBottom(true)
}

function createMessageHtml(message, nextMessage, lastSenderId) {
    const isMine = message.sender._id === userLoggedJs._id
    let liClassName = isMine ? "mine" : "theirs"; // to indicate as my message ot not (style and so on)

    // TODO: fix right class first and last, currently it's some mess
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

    let nameElement = ""
    if (isFirst) {
        liClassName += " first"

        if (!isMine) {
            nameElement = `<span class="senderName">${senderName}</span>`
        }
    }

    let profileImage = ""
    if (isLast) {
        liClassName += " last"
        profileImage = `<img src="${sender.profilePic}" alt=""/>`
    }

    let imageContainer = ""
    if (!isMine) {
        imageContainer = `<div class="imageContainer">
                                ${profileImage}
                          </div>`
    }

    return `<li class='message ${liClassName}'>
                ${imageContainer}
                <div class='messageContainer'>
                    ${nameElement}
                    <span class='messageBody'>
                        ${message.content}
                    </span>
                </div>
            </li>`;
}

function scrollToBottom(animated) {
    const container = $(".chatMessages")
    const scrollHeight = container[0].scrollHeight;

    if(animated) {
        container.animate({scrollTop: scrollHeight}, 'slow')
        window.scrollTo(0, document.body.scrollHeight);
    } else {
        container.scrollTop(scrollHeight)
        window.scrollTo(0, document.body.scrollHeight);
    }
}