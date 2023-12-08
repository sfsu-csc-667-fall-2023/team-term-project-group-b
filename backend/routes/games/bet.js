const { Games, Users } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");

const method = "post";
const route = "/:id/bet";

const handler = async (request, response) => {
const io = request.app.get("io");

  const { id: textGameId } = request.params;
  const { id: userId } = request.session.user;

  const gameId = parseInt(textGameId);

  // Check if player in game
  const isPlayerInGame = await Games.isPlayerInGame(gameId, userId);
  console.log({ isPlayerInGame, gameId, userId });
}

module.exports = { method, route, handler };