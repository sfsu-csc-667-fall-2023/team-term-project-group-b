import { io } from "socket.io-client";
const GAME_CONSTANTS = require("../../constants/games");

let userSocket;

const user_socket_id = document.querySelector("#user-socket-id").value;

const configure = (socketId) => {
  userSocket = io({ query: { id: socketId } });
  console.log("userSocketConfig");


  console.log(socketId);

  const cardTemplate = document.querySelector("#card");
  const userHand = document.querySelector(".player-hand");

  Object.keys(GAME_CONSTANTS).forEach((key) => {
    userSocket.on(GAME_CONSTANTS[key], (data) => {
      console.log({ event: GAME_CONSTANTS[key], data });
    });
  });

  console.log("User socket configured");

  userSocket.on(GAME_CONSTANTS.USER_STATE_UPDATED, userStateUpdated);
};

const cardTemplate = document.querySelector("#card");
const playerHand = document.querySelector(".player-hand");

const userStateUpdated = ({ game_id, current_player, players }) => { //updates ui when there is change in game_state
  console.log("inside userStateUpdated");
  console.log(players);
  console.log(user_socket_id + "-  socketId");
  const playerCards = players.find((player) => player.sid === user_socket_id).hand;
  
  console.log({playerCards});

  playerHand.innerHTML = "";

  playerCards.forEach(({ suit, value }) => {
    const container = cardTemplate.content.cloneNode(true);
    const div = container.querySelector(".card");
    div.classList.add(`suits-${suit}`);
    div.classList.add(`value-${value}`);
    playerHand.appendChild(div);
  })

};


export { configure };