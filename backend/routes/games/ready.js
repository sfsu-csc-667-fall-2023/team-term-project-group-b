const { Games, Users } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");


const method = "post";
const route = "/:id/ready";

const handler = async (request, response) => {
    const io = request.app.get("io");

    const { id: gameId } = request.params;
    const gameState = await Games.initialize(parseInt(gameId));

    io.to(gameState.game_socket_id).emit(GAME_CONSTANTS.START, gameState);
    gameState.players.forEach(player =>{
        io.to(player.sid).emit(GAME_CONSTANTS.USER_STATE_UPDATED, gameState);
    });
    io.to(gameState.game_socket_id).emit(`game:deleteChat:${gameId}`);

    response.status(200).send();
};

module.exports = { method, route, handler };