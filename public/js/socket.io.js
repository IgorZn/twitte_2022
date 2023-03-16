let connected, socket
socket = io();

socket.emit("setup", userLoggedJs)
socket.on("client_connected", () => {
    console.log("Client connected to server socket")
    connected = true
})

