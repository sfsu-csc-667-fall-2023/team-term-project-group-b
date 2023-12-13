import { io } from "socket.io-client";
const GAME_CONSTANTS = require("../../constants/games");

let gameSocket;

const configure = (socketId) => {
  gameSocket = io({ query: { id: socketId } });

  console.log("gameSocket configured!!");

  gameSocket.on(GAME_CONSTANTS.START);
  gameSocket.on(GAME_CONSTANTS.DEALER_STATE_UPDATED, renderDealerHand);

  gameSocket.on(GAME_CONSTANTS.USER_ADDED, data => {
    console.log({event: GAME_CONSTANTS.USER_ADDED, data });
  })

  gameSocket.on(GAME_CONSTANTS.STATE_UPDATED, data =>{
    console.log(data);
  });
  
  gameSocket.on(`game:deleteChat:${roomId}`, () => {
    if (startButton) {
      startButton.remove();
    }
});
};

const cardTemplate = document.querySelector("#card");

const dealerHand = document.querySelector(".dealer");

const roomId = document.querySelector("#room-id").value;
const startButton = document.querySelector("#start");


const renderDealerHand = ({hand}) => { //updates ui when there is change in game_state
  dealerHand.innerHTML = "";
  hand.forEach(({ suit, value }) => {
    const container = cardTemplate.content.cloneNode(true);
    const div = container.querySelector(".card");
    div.classList.add(`suits-${suit}`);
    div.classList.add(`value-${value}`);
    dealerHand.appendChild(div);
  })

};

export {configure};