import { io } from "socket.io-client";
import * as GAME_CONSTANTS from "@constants/games";

let userSocket;

const configure = (socketId) => {
  userSocket = io({ query: { id: socketId } });

  Object.keys(GAME_CONSTANTS).forEach((key) => {
    userSocket.on(GAME_CONSTANTS[key], (data) => {
      console.log({ event: GAME_CONSTANTS[key], data });
    });
  });

  console.log("User socket configured");

  return Promise.resolve();
};

export { configure };