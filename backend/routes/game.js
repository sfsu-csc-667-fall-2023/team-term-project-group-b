const GAME_CONSTANTS = require("../../constants/games");
const express = require("express");
const crypto = require("crypto");
const router = express.Router();

const { Games, Users } = require("../db");

router.get("/create" , async (request, response) => {
    const { id: userId } = request.session.user;
    const io = request.app.get("io");
    const { id: gameId } = await Games.create(
        crypto.randomBytes(20).toString('hex')
    );       
    //unique game id created here
    await Games.addUser(gameId, userId);
    await Games.createGameState(gameId, 1, 1, 0, 0); //id, round, turn, player count, pot 
    
    io.emit(GAME_CONSTANTS.CREATED, { id: gameId, createdBy: userId});

    response.redirect(`/game/${gameId}`);
})

router.post("/:id/ready", async (request, response) => {
    const io = request.app.get("io");
    const { id: gameId } = request.params;
    const { id: userId } = request.session.user;

    const { initialized } = await Games.isInitialized(gameId);
    const { ready_count, player_count } = await Games.readyPlayer(userId, gameId);
    console.log({ ready_count, player_count, initialized });

    await Games.setUserChips(gameId, userId);
    const method = ready_count <= 1 || initialized ? "initialize" : "getGameState"; // TODO set limit
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
      const totalPlayers = await Games.addUser(gameId, userId);
      //const chips = await Games.setUserChips(gameId, userId);
      console.log({totalPlayers});
      // todo
      //const hand = await Games.getUserHand(gameId, userId);
      //const seat = await Games.getUserSeat(gameId, userId);
    }
  // construct json with user hand, chips,seat
    response.redirect(`/game/${gameId}`);
  /*const { id: gameId } = request.params;
  const { id: userId, email: userEmail } = request.session.user;

  const io = request.app.get("io");

  await Games.addUser(userId, gameId);
  io.emit(GAME_CONSTANTS.USER_ADDED, { userId, userEmail, gameId });

  const userCount = await Games.userCount(gameId);

  if (userCount === 2) {
    const gameState = await Games.initialize(gameId);
    const { game_socket_id: gameSocketId } = await Games.getGameSocket(gameId);

    io.to(gameSocketId).emit(GAME_CONSTANTS.START, {
      currentPlayer: gameState.current_player,
    });
    Object.keys(gameState.hands).forEach((playerId) => {
      const playerSocket = Users.getUserSocket(playerId);

      io.to(playerSocket).emit(GAME_CONSTANTS.STATE_UPDATED, {
        hand: gameState.hands[playerId],
      });
    });
  }

  response.redirect(`/games/${gameId}`);*/
});

router.get("/:id", async (request, response) => {
    const {id: gameId} = request.params;
    const{id: userId, username} = request.session.user;
    const{ game_socket_id: gameSocketId } = await Games.getGameSocket(gameId);
    const{ sid: userSocketId } = await Users.getUserSocket(userId)
    console.log("game:", gameSocketId);
    console.log("user:", userSocketId);
    response.render("game", {id: gameId, gameSocketId, userSocketId, roomId: gameId});
});

module.exports = router;
