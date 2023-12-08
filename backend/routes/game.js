const GAME_CONSTANTS = require("../../constants/games");
const express = require("express");
const crypto = require("crypto");
const { createHash } = crypto;
const router = express.Router();
const { Games, Users } = require("../db");
const { isInitialized } = require("../db/games");

router.get("/create" , async (request, response) => {
    const { id: userId } = request.session.user;
    const io = request.app.get("io");
    const { id: gameId } = await Games.create(
        crypto.randomBytes(20).toString('hex')
    );
    await Games.addUser(gameId, userId);
    await Games.createGameState(gameId, 1, 1, 0, 0); //id, round, turn, player count, pot 
    await Games.setUserChips(gameId, userId);
    await Games.readyPlayer(userId, gameId);
    io.emit(GAME_CONSTANTS.CREATED, { id: gameId, createdBy: userId});
    response.redirect(`/game/${gameId}`);
})

router.post("/:id/ready", async (request, response) => {
    const io = request.app.get("io");
    const { id: gameId } = request.params;
    const { initialized } = await Games.isInitialized(gameId);
    console.log({gameId, initialized });
    const gameState = await Games.initialize(parseInt(gameId));
    io.to(gameState.game_socket_id).emit(GAME_CONSTANTS.STATE_UPDATED, gameState);
    io.to(gameState.game_socket_id).emit(`game:deleteChat:${gameId}`);
    response.status(200).send();
});

router.get("/:id/join", async (request, response) => {
  const { id: gameId } = request.params;
  const { id: userId } = request.session.user;
  const result = await isInitialized(gameId);
  const gameUsers = await Games.usersInGame(gameId);
  const userInGameAlready = gameUsers.some((user) => user.user_id === userId);
    if(result.initialized && !userInGameAlready){
      response.status(403).redirect("/lobby");
    }
    else{
    if (!userInGameAlready) {
      await Games.addUser(gameId, userId);
      await Games.readyPlayer(userId, gameId);
      await Games.setUserChips(gameId, userId);
    }
  response.redirect(`/game/${gameId}`);
  }
});

router.get("/:id", async (request, response) => {
    const {id: gameId} = request.params;
    const{id: userId, username} = request.session.user;
    const{ game_socket_id: gameSocketId } = await Games.getGameSocket(gameId);
    const{ sid: userSocketId } = await Users.getUserSocket(userId);
    const result = await isInitialized(gameId);
    response.render("game", {id: gameId, gameSocketId, userSocketId, roomId: gameId, is_initialized: result});
});


module.exports = router;
