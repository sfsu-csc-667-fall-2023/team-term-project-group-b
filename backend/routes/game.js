const GAME_CONSTANTS = require("../../constants/games");
const express = require("express");
const crypto = require("crypto");
const router = express.Router();

const { Games, Users } = require("../db");
const { response } = require("express");
const { log } = require("console");

router.get("/create" , async (request, response) => {
    const { id: userId } = request.session.user;
    const io = request.app.get("io");

    const { id: gameId } = await Games.create(
        crypto.randomBytes(20).toString('hex')
    );        //unique game id created here
    //console.log(userId + " - user id");
    //console.log(gameId + " - game id");
    await Games.addUser(userId, gameId);


    io.emit(GAME_CONSTANTS.CREATED, { id: gameId });

    response.redirect(`/game/${gameId}`);
})

router.post("/:id/ready", async (request, response) => {
    const io = request.app.get("io");
    const { id: gameId } = request.params;
    const { id: userId } = request.session.user;

    const { initialized } = await Games.isInitialized(gameId);
    const { ready_count, player_count } = await Games.readyPlayer(userId, gameId);
    console.log({ ready_count, player_count, initialized });

    const method = ready_count !== 2 || initialized ? "getState" : "initialize";

    const gameState = await Games[method](parseInt(gameId));

    console.log({ gameState, method });

    io.to(gameState.game_socket_id).emit(GAME_CONSTANTS.STATE_UPDATED, gameState);

    response.status(200).send();
    
});

router.get("/:id/join", async (request, response) => {
    const { id: gameId } = request.params;
    const { id: userId } = request.session.user;
  
    const gameUsers = await Games.usersInGame(gameId);
    const userInGameAlready = gameUsers.some((user) => user.user_id === userId);
  
    if (!userInGameAlready) {
      await Games.addUser(userId, gameId);
    }else{
        console.log('In:', userId);
    }
  
    response.redirect(`/game/${gameId}`);
  });

router.get("/:id", async (request, response) => {
    const {id: gameId} = request.params;
    const{id: userId, username} = request.session.user;
    const{ game_socket_id: gameSocketId } = await Games.getGame(gameId);
    const{ sid: userSocketId } = await Users.get_user_sockerId(userId)
    console.log("game:", gameSocketId);
    console.log("user:", userSocketId);
    response.render("game", {id: gameId, gameSocketId, userSocketId, roomId: gameId});
});

module.exports = router;
