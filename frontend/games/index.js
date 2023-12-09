import { configure as gameSocketConfig } from "./game_socket";
import { configure as userSocketConfig } from "./user_socket";

const gameSocketId = document.querySelector("#game-socket-id").value;   //getting from html doms
const userSocketId = document.querySelector("#user-socket-id").value;
const roomId = document.querySelector("#room-id").value;
const startButton = document.querySelector("#start");

gameSocketConfig(gameSocketId);
userSocketConfig(userSocketId);

const holdForm = document.querySelector("#hold-form");
const callForm = document.querySelector("#call-form");
const betForm = document.querySelector("#bet-form");
const foldForm = document.querySelector("#fold-form");

const handleUserAction = (event) => {
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

holdForm.addEventListener("submit", handleUserAction);
callForm.addEventListener("submit", handleUserAction);
betForm.addEventListener("submit", handleUserAction);
foldForm.addEventListener("submit", handleUserAction);