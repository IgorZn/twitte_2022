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
    const chatName = getChatName(chatData);
    const image = getChatImageElements(chatData);
    const latestMessage = "This is the latest message";

    return `<a href='/messages/${chatData._id}' class='resultListItem'>
                ${image}
                <div class='resultsDetailsContainer ellipsis'>
                    <span class='heading ellipsis'>${chatName}</span>
                    <span class='subText ellipsis'>${latestMessage}</span>
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


function getChatImageElements(chatData) {
    const otherChatUsers = getOtherChatUsers(chatData.users)

    let groupChatClass = "";
    let chatImage = getUserChatImageElement(otherChatUsers[0])

    if(otherChatUsers.length > 1) {
        groupChatClass = "groupChatImage";

        // simple add another image to 'chatImage'
        chatImage += getUserChatImageElement(otherChatUsers[1])
    }
    // console.log(chatImage)
    return `<div class='resultsImageContainer ${groupChatClass}'>${chatImage}</div>`;

}


function getUserChatImageElement(user){
    if(!user || !user.profilePic){
        return alert("User passed into function is invalid")
    }

    return `<img src='${user.profilePic}' alt='User's profile pic'>`;
}