let connected, socket
connected = false
socket = io();

socket.emit("setup", userLoggedJs);
socket.on("client_connected", () => {
    console.log("Client connected to server socket")
    connected = true
});

// Received new message and display/notify user
socket.on("message_received", newMessage => messageReceived(newMessage));

