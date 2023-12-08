const { Games, Users } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");

const method = "post";
const route = "/:id/fold";

const handler = async (request, response) => {
    const io = request.app.get("io");
    
    const { id: textGameId } = request.params;
    const { id: userId } = request.session.user;
    
    const gameId = parseInt(textGameId);
    
    // Check if player in game
    const isPlayerInGame = await Games.isPlayerInGame(gameId, userId);
    console.log({ isPlayerInGame, gameId, userId });

    
    // Broadcast
    const state = await Games.getState(gameId);
    io.to(state.game_socket_id).emit(GAME_CONSTANTS.STATE_UPDATED, state);
  
    response.status(200).send();
}
    
module.exports = { method, route, handler };