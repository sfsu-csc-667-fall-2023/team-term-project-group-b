const { Games, Users } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");

const method = "post";
const route = "/:id/bet";

//player enters in amt to bet, mustr match or exceed current bet
//after bet, checks current seat(current player), and cycles
//checks if we are at the end of turn 3
  //at end of turn three, run hand evaluator middleware

const handler = async (request, response) => {
const io = request.app.get("io");

  const { id: textGameId } = request.params;
  const { id: userId } = request.session.user;

  const gameId = parseInt(textGameId);

  // Check if player in game
  const isPlayerInGame = await Games.isPlayerInGame(gameId, userId);
  console.log({ isPlayerInGame, gameId, userId });

  
  // Broadcast
  /*const state = await Games.getState(gameId);
  io.to(state.game_socket_id).emit(GAME_CONSTANTS.STATE_UPDATED, state);
  
  response.status(200).send();*/
}

module.exports = { method, route, handler };