import { io } from "socket.io-client";

const chatSocket = io();

chatSocket.on("chat:message:0", payload => {
    console.log({payload});
})