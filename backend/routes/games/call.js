const { Games, Users } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");
const method = "post";
const route = "/:id/call";

const handler = async (request, response) => {
    const io = request.app.get("io");
    const { id: textGameId } = request.params;
    const { id: userId } = request.session.user;
    const user_socket_id = await Users.getUserSocket(userId);
    const gameId = parseInt(textGameId);
    const isPlayerInGame = await Games.isPlayerInGame(gameId, userId);
    const isPlayerTurn = await Games.checkTurn(gameId, userId);
    console.log(isPlayerInGame, isPlayerTurn, "lol");
    if(isPlayerInGame && isPlayerTurn){
        const playerSeat = await Games.getPlayerSeat(gameId, userId);
        const nextPlayer = await Games.updateTurn(gameId, playerSeat);
        console.log(nextPlayer);
        const user_socket_id = Users.getUserSocket(userId);
        const t = `user with id ${userId} called`;
        io.to(user_socket_id).emit("test", t);
    }
    /*// Broadcast
    const state = await Games.getState(gameId);
    io.to(state.game_socket_id).emit(GAME_CONSTANTS.STATE_UPDATED, state);

    response.status(200).send();*/
    response.status(200).send();
}
    
module.exports = { method, route, handler };