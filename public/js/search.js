let timer, value;

// $("#searchBox").on("keydown", (event) => {
//     clearTimeout(timer);
//     const textbox = $(event.target);
//     value = textbox.val();
//     const searchType = textbox.data().search;
//
//     timer = setTimeout(() => {
//         value = textbox.val().trim();
//
//         if(value == "") {
//             $(".resultsContainer").html("");
//         }
//         else {
//             console.log(value)
//         }
//     }, 1000)
//
//
//     // console.log(value)
//     // console.log(searchType)
// })

/*
* keyup -- https://stackoverflow.com/a/5340815/6671330
* */

document.getElementById("searchBox")
    .addEventListener('keyup', (event) => {
        clearTimeout(timer)
        const textbox = event.target;
        const text = textbox.value.trim();
        const searchType = document.querySelector("[data-search]").attributes["data-search"].value

        timer = setTimeout(() => {
            value = text;

            if (value == "") {
                $(".resultsContainer").html("");
            } else {
                makeSearch(text, searchType)
            }
        }, 1000)

        // console.log('text>>>', value)
        // console.log('searchType>>>', searchType)
    });


function makeSearch(searchTerm, searchType) {
    let url = searchType == "users" ? "/api/v1/users?" : "/api/v1/posts?";
    const options = {
        method: 'GET',
    }
    // https://stackoverflow.com/a/58437909/6671330

    fetch(url + new URLSearchParams({search: searchTerm}), options)
        .then(res => {
            // this 'res.json()' will go the next 'then' below as a result (data)
            return res.json()
                .then(json => {
                    return json
                })
        })
        .then(data => {
            console.log(data)
            // show search results
            if(searchType.includes("users")){
                outputUser(data.data, $(".resultsContainer"))
            } else {
                outputPosts(data.data, $(".resultsContainer"))
            }
        })
}