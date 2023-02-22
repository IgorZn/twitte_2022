// -- JS

document
    .getElementById("userSearchTextBox")
    .addEventListener('keydown', (event) => {
        clearTimeout(timer)
        const textbox = event.target;
        const value = textbox.value.trim();

        // Delete already added user in 'input' field by
        // pressing 'backspace' (<--)
        if (value == "" && event.key == "Backspace") {
            selectedUsers.pop()
            // Upd list of users
            updateSelectedUsersHtml()
            // Clear search results
            $(".resultsContainer").html("");

            if(selectedUsers.length == 0){
                $("#createChatButton").prop("disabled", true)
            }
            return;
        }

        timer = setTimeout(() => {
            if (value == "") {
                $(".resultsContainer").html("");
            } else {
                makeSearchUsers(value)
            }
        }, 1000)

        // console.log('text>>>', value)
        // console.log('searchType>>>', searchType)
    });

