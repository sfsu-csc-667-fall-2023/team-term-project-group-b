import { io } from "socket.io-client";
const GAME_CONSTANTS = require("../../constants/games");

let userSocket;

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

  userSocket.on(GAME_CONSTANTS.USER_STATE_UPDATED, ({gameState}) =>{
    userStateUpdated(gameState);
  });
};

const playerHand = document.querySelector(".player-hand");

const userStateUpdated = ({ game_id, current_player, players, user_socket_id }) => { //updates ui when there is change in game_state
  console.log("inside userStateUpdated");
  //console.log(request.session.user.id);
  //const playerCards = players.find((player) => player.user_id === request.session.user.id).hand;
  //const playerCards = players.find((player) => player.user_id === 1).hand;


  //console.log({ playerCards});

  //updateHand(dealerHand, dealerCards);

};


export { configure };