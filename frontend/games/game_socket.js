import { io } from "socket.io-client";
const GAME_CONSTANTS = require("../../constants/games");

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

const cardTemplate = document.querySelector("#card");

const dealerHand = document.querySelector(".dealer");

const roomId = document.querySelector("#room-id").value;
const startButton = document.querySelector("#start");


const updateHand = (handContainer, cardList) => {
  handContainer.innerHTML = "";

  cardList.forEach(({ suit, value }) => {
    const container = cardTemplate.content.cloneNode(true);
    const div = container.querySelector(".card");
    div.classList.add(`suits-${suit}`);
    div.classList.add(`value-${value}`);
    handContainer.appendChild(div);
  })
}

const stateUpdated = ({ game_id, current_player, players }) => { //updates ui when there is change in game_state
  const dealerCards = players.find((player) => player.user_id === -1).hand;
  console.log({ dealerCards/*, playerCards*/});

  updateHand(dealerHand, dealerCards);
  console.log(current_player);

};

export {configure};