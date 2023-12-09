import { io } from "socket.io-client";
import * as GAME_CONSTANTS from "@constants/games";

const roomId = document.querySelector("#room-id").value;
const startButton = document.querySelector("#start");

const cardTemplate = document.querySelector("#card");

const holeCards = document.querySelector(".hole-cards");
const playerHand = document.querySelector(".plaer-hand");

let gameSocket;

const configure = (socketId) => {
  gameSocket = io({ query: { id: socketId } });

  console.log("gameSocket configured!!");

  gameSocket.on(GAME_CONSTANTS.START, data => {
    // TODO
    console.log({event: GAME_CONSTANTS.START, data });
  })

  gameSocket.on(GAME_CONSTANTS.USER_ADDED, data => {
    console.log({event: GAME_CONSTANTS.USER_ADDED, data });
  })

  gameSocket.on(GAME_CONSTANTS.STATE_UPDATED, stateUpdated);

  gameSocket.on(`game:deleteChat:${roomId}`, () => {
    console.log(`game:deleteChat:${roomId}`);
    if (startButton) {
      startButton.remove();
    }
});
};

const stateUpdated = ({ game_id, current_player, players }) => { //updates ui when there is change in game_state
  const dealerCards = players.find((player) => player.user_id === -1).hand;
  //const playerCards = players.find((player) => player.user_id === 1).hand;
  console.log({ dealerCards/*, playerCards*/});
};

export {configure};