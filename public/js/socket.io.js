let connected, socket
socket = io();

socket.emit("setup", userLoggedJs)
socket.on("client_connected", () => {
    console.log("Emit connected")
    connected = true
})