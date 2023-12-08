import { io } from "socket.io-client";

const chatWindow = document.querySelector("#chat-window");

const chatSocket = io();

const roomId = document.querySelector("#room-id").value;

chatSocket.on(`chat:message:${roomId}`, ({ from, timestamp, message, hash }) => {
      //const div = document.querySelector("#chat-message").content.cloneNode(true);
      const div = document.createElement("a")
      div.classList.add("message");
      //const img = div.querySelector("img");
      const img = document.createElement("img");
      img.src = `https://gravatar.com/avatar/${hash}?s=30`;
      img.alt = `Avatar of ${from}`;
  
      const p = document.createElement("p");
      p.innerText = message;
      div.appendChild(img);
      div.appendChild(p);
  
      chatWindow.appendChild(div);
    },
  );

document.querySelector("#message").addEventListener("keydown", (event) => {
    if (event.keyCode === 13) {
      const message = event.target.value;
      const url = event.target.dataset.url;
  
      fetch(`/chat/${roomId}`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      
      event.target.value = "";
    }
  });
