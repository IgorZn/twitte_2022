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
    console.log(chatList)
    chatList.forEach(chat => {
        const html = createChatHtml(chat)
        container.append(html)
    })

    if(!chatList.length) {
        container.append("<span class='noResults'>Nothing to show.</span>")
    }
};


function createChatHtml(chatData) {
    const chatName = getChatName(chatData); // TODO
    const image = ""; // TODO
    const latestMessage = "This is the latest message";

    return `<a href='/messages/${chatData._id}' class='resultListItem'>
                <div class='resultsDetailsContainer'>
                    <span class='heading'>${chatName}</span>
                    <span class='subText'>${latestMessage}</span>
                </div>
            </a>`;
};


function getChatName(chatData) {
    let chatName = chatData.chatName

    if(!chatName){
        const otherChatUsers = getOtherChatUsers(chatData.users);
        const namesArrray = otherChatUsers.map( user => `${user.fullName}`)
        chatName = namesArrray.join(', ')
    }

    return chatName

}


function getOtherChatUsers(users) {
    if(users.length == 1) return users
    return users.filter(user => user._id != userLoggedJs._id)
}