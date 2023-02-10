let timer;


document.getElementById("searchBox")
    .onkeydown = (event) => {
    clearTimeout(timer)
    const textbox = event.target;
    const text = textbox.value;
    const searchType = document.querySelector("[data-search]").attributes["data-search"].value

    console.log('text>>>', text)
    console.log('searchType>>>', searchType)
}