import { io } from "socket.io-client";

const socket = io();

socket.on("game:created", payload =>{
    console.log(payload);
})