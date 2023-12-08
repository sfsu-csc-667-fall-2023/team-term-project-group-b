import { io } from "socket.io-client";
import * as GAME_CONSTANTS from "@constants/games";

const roomId = document.querySelector("#room-id").value;
const startButton = document.querySelector("#start");
let gameSocket;

const configure = (socketId) => {
  gameSocket = io({ query: { id: socketId } });
  console.log("Game socket configured");

  gameSocket.on(GAME_CONSTANTS.START, data => {
    // TODO
    console.log({event: GAME_CONSTANTS.START, data });
  })

  gameSocket.on(GAME_CONSTANTS.USER_ADDED, data => {
    console.log({event: GAME_CONSTANTS.USER_ADDED, data });
  })

gameSocket.on(`game:deleteChat:${roomId}`, () => {
  console.log(`game:deleteChat:${roomId}`);
  if (startButton) {
    startButton.remove();
  }
});

  return Promise.resolve();
};
export {configure};