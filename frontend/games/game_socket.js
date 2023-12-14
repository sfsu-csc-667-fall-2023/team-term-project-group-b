import { io } from "socket.io-client";
const GAME_CONSTANTS = require("../../constants/games");

let gameSocket;

const cardTemplate = document.querySelector("#card");
const dealerHand = document.querySelector(".dealer");
const turnDiv = document.querySelector(".turn");
const roundDiv = document.querySelector(".round");
const potDiv = document.querySelector(".pot");
const betDiv = document.querySelector(".bet");
const roomId = document.querySelector("#room-id").value;
const startButton = document.querySelector("#start");

const configure = (socketId) => {
  gameSocket = io({ query: { id: socketId } });

  console.log("gameSocket configured!!");

  gameSocket.on(GAME_CONSTANTS.START, data => {
    console.log({event: GAME_CONSTANTS.START, data });
  })

  gameSocket.on(GAME_CONSTANTS.DEALER_STATE_UPDATED, renderDealerHand);

  gameSocket.on(GAME_CONSTANTS.UPDATE_ROUND, updateRound);

  gameSocket.on(GAME_CONSTANTS.UPDATE_CURRENT_TURN, updateCurrentTurn);

  gameSocket.on(GAME_CONSTANTS.UPDATE_CURRENT_POT, updateCurrentPot);

  gameSocket.on(GAME_CONSTANTS.UPDATE_MIN_BET, updateMinBet);

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

const updateRound = ({round}) => {
  roundDiv.innerHTML = "Current round: " + round;
}

const updateCurrentTurn = ({turn}) => {
  turnDiv.innerHTML = "Current Turn " + turn;
}

const updateCurrentPot = ({pot}) => {
  potDiv.innerHTML = "Current Pot " + pot;
}

const updateMinBet = ({bet}) => {
  betDiv.innerHTML = "Current Bet " + bet;
}

export {configure};