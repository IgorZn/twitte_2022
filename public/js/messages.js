// -- JS

document
    .getElementById("userSearchTextBox")
    .addEventListener('keyup', (event) => {
        clearTimeout(timer)
        const textbox = event.target;
        const value = textbox.value.trim();

        // Delete already added user in 'input' field by
        // pressing 'backspace' (<--)
        if (value == "" && event.key == 8) {
            console.log('value == "" && event.key == 8')
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

