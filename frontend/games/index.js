import { configure as gameSocketConfig } from "./game_socket";
import { configure as userSocketConfig } from "./user_socket";

const gameSocketId = document.querySelector("#game-socket-id").value;   //getting from html doms
const userSocketId = document.querySelector("#user-socket-id").value;
const roomId = document.querySelector("#room-id").value;

gameSocketConfig(gameSocketId)
  .then((_) => userSocketConfig(userSocketId))
  .then((_) => {
    console.log("Fetching");
    fetch(`/game/${roomId}/ready`, { method: "post" });
  });

  // we will add our own actions and behaviour for texas holdem
//const hitForm = document.querySelector("#hit-form");
//const stayForm = document.querySelector("#stay-form");

const handleUserAction = (event) => {
  event.preventDefault();

  const { action, method } = event.target.attributes;
  fetch(action.value, { method: method.value });

  return false;
};
  // we will add our own actions and behaviour for texas holdem

//hitForm.addEventListener("submit", handleUserAction);
//stayForm.addEventListener("submit", handleUserAction);


// rewrite to make sure that when game is created it automatically shows up:
// const gameId = document.querySelector("#")
// const gameSocket = io({ query: { gameSocketId } });
// const userSocket = io({query: {userSocket }}); 
// chatSocket.on(`game:created"`, ({ from, timestamp, message, hash }) => {
//       //const div = document.querySelector("#chat-message").content.cloneNode(true);
//       const div = document.createElement("div")
  
//       const p = document.createElement("p");
//       p.innerText = message;
//       div.appendChild(img);
//       div.appendChild(p);
  
//       chatWindow.appendChild(div);
//     },
//   );