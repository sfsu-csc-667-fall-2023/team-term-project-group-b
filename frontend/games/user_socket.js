import { io } from "socket.io-client";
const GAME_CONSTANTS = require("../../constants/games");

let userSocket;
const user_socket_id = document.querySelector("#user-socket-id").value;
const cardTemplate = document.querySelector("#card");
const playerHand = document.querySelector(".player-hand");
const personalDiv = document.querySelector(".personal");
const statusDiv = document.querySelector(".status");

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

  userSocket.on(GAME_CONSTANTS.UPDATE_PLAYER_POT, updatePlayerPot);

  userSocket.on(GAME_CONSTANTS.UPDATE_PLAYER_STATUS, updatePlayerStatus);
  
  userSocket.on(`chat:message`, ({ from, timestamp, message, hash }) => {
    appendMessage(from, message, hash);
  });
};

function appendMessage(from, message, hash){
    const div = document.createElement("a")
    div.classList.add("message");
    const img = document.createElement("img");
    img.src = `https://gravatar.com/avatar/${hash}?s=30`;
    img.alt = `Avatar of ${from}`;

    const p = document.createElement("p");
    p.classList.add("message-text");
    p.innerText = message;
   
    div.appendChild(img);
    div.appendChild(p);

    chatWindow.appendChild(div);
}

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

const updatePlayerPot = ({}) => {

}

const updatePlayerStatus = ({}) => {

}


export { configure };