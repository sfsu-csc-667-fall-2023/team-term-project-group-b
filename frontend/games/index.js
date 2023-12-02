import { io } from "socket.io-client";

const gameSocketId = document.querySelector("#game-socket-id").value;

const gameSocket = io({ query: { gameSocketId } });