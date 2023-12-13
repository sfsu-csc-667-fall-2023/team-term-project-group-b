import { configure as gameSocketConfig } from "./game_socket";
import { configure as userSocketConfig } from "./user_socket";

const gameSocketId = document.querySelector("#game-socket-id").value;   //getting from html doms
const userSocketId = document.querySelector("#user-socket-id").value;
const roomId = document.querySelector("#room-id").value;

const startButton = document.querySelector("#start");
const holdButton = document.querySelector("#hold-form");
const callButton = document.querySelector("#call-form");
const betButton = document.querySelector ("#bet-form");
const foldButton = document.querySelector("#fold-form");

gameSocketConfig(gameSocketId);
userSocketConfig(userSocketId);

const handleUserAction = async (event) => {
  event.preventDefault();

  const { action, method } = event.target.attributes;
  fetch(action.value, { method: method.value });
  return false;
};



startButton.addEventListener("click", (event) => {
  const gameId = event.target.value;
  fetch(`/game/${gameId}/ready`, {
    method: "post",
    headers: { "Content-Type": "application/json" },
  });
});

callButton.addEventListener("submit", handleUserAction);
holdButton.addEventListener("submit", handleUserAction);
betButton.addEventListener("submit", handleUserAction);
foldButton.addEventListener("submit", handleUserAction);