const { Games, Users } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");


const method = "post";
const route = "/:id/ready";

const handler = async (request, response) => {
    const io = request.app.get("io");

    const { id: gameId } = request.params;
    const { id: userId } = request.session.user;    
    const user_socket_id = await Users.getUserSocket(userId);
    
    const gameState = await Games.initialize(parseInt(gameId));
    io.to(gameState.game_socket_id).emit(GAME_CONSTANTS.STATE_UPDATED, gameState);
    io.to(user_socket_id.sid).emit(GAME_CONSTANTS.USER_STATE_UPDATED, gameState);
    io.to(gameState.game_socket_id).emit(`game:deleteChat:${gameId}`);

    response.status(200).send();
};

module.exports = { method, route, handler };