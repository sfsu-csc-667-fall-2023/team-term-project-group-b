import { io } from "socket.io-client";
const GAME_CONSTANTS = require("../../constants/games");

let userSocket;
const user_socket_id = document.querySelector("#user-socket-id").value;
const cardTemplate = document.querySelector("#card");
const playerHand = document.querySelector(".player-hand");
const playerChipsDiv = document.querySelector(".playerChips");
const errorMessageDiv = document.querySelector(".errorMessage");
const generalMessagesDiv = document.querySelector(".generalMessages");

const configure = (socketId) => {
  userSocket = io({ query: { id: socketId } });

  Object.keys(GAME_CONSTANTS).forEach((key) => {
    userSocket.on(GAME_CONSTANTS[key], (data) => {
      console.log({ event: GAME_CONSTANTS[key], data });
    });
  });
  
  console.log("User socket configured");

  userSocket.on(GAME_CONSTANTS.USER_STATE_UPDATED,data => {
    console.log({event: GAME_CONSTANTS.USER_STATE_UPDATED, data });
  })
  
  userSocket.on(GAME_CONSTANTS.START, renderPlayerState);

  userSocket.on(GAME_CONSTANTS.UPDATE_PLAYER_CHIPS, updatePlayerChips);

  userSocket.on(GAME_CONSTANTS.UPDATE_PLAYER_STATUS, updatePlayerStatus);

  userSocket.on(GAME_CONSTANTS.ERROR_MESSAGE, renderError);

  userSocket.on(GAME_CONSTANTS.SUCCESSFUL_PLAYER_ACTION_MESSAGE, renderSucess);

};

const renderPlayerState = ({chips, hand, seat}) => {
  playerHand.innerHTML = "";
  hand.forEach(({ suit, value }) => {
    const container = cardTemplate.content.cloneNode(true);
    const div = container.querySelector(".card");
    div.classList.add(`suits-${suit}`);
    div.classList.add(`value-${value}`);
    playerHand.appendChild(div);
  })

};

const updatePlayerChips = ({chips}) => {
  playerChipsDiv.innerHTML = "Player Chips: " + chips
}

const updatePlayerStatus = ({}) => {

}

const renderError = ({message}) => {
  errorMessageDiv.innerHTML = message;
}


export { configure };