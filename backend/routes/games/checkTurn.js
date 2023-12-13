const { Games, Users } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");
const {getCurrentTurn} = require("../../db");
const { getPlayerSeat } = require("../../db");
const method = "post";
const route = "/:id/call";

const handler = async (request, response) => {
    const io = request.app.get("io");
    const { id: textGameId } = request.params;
    const { id: userId } = request.session.user;
    
    const gameId = parseInt(textGameId);
    const isPlayerInGame = await Games.isPlayerInGame(gameId, userId);

    const currentTurn = await Games.getCurrentTurn(gameId);
    const userSeat = await Games.getPlayerSeat(gameId, userId);
    console.log(isPlayerInGame, currentTurn, userSeat);
    if(isPlayerInGame){
        if(currentTurn == userSeat){
            console.log("worked");
            response.status(200).send();
        }
    }
    /*// Broadcast
    const state = await Games.getState(gameId);
    io.to(state.game_socket_id).emit(GAME_CONSTANTS.STATE_UPDATED, state);

    response.status(200).send();*/
}
    
module.exports = { method, route, handler };