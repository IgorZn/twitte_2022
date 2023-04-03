$(document).ready(() => {
    $.ajax({
        url: '/api/v1/chats',
        type: "GET",
        success: (data, status, xhr) => {
            console.log('inboxPage>>>',data, status)
            if(xhr.status == 400){
                alert('Could not get chat list')
            } else {
                outputChatList(data.data, $('.resultsContainer'))
            }

            // setTimeout(() => console.log(data.data, status), 500)
            // location.href = `/messages/${data.data._id}`

        }
    })
})


function outputChatList(chatList, container) {
    console.log('outputChatList>>>', chatList)
    chatList.forEach(chat => {
        const html = createChatHtml(chat)
        container.append(html)
    })

    if(!chatList.length) {
        container.append("<span class='noResults'>Nothing to show.</span>")
    }
};

















