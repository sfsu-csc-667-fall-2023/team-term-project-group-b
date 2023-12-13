const { Games, Users } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");


const method = "post";
const route = "/:id/ready";

const handler = async (request, response) => {
    const io = request.app.get("io");

    const { id: gameId } = request.params;
    const gameState = await Games.initialize(parseInt(gameId));

    io.to(gameState.game_socket_id).emit(GAME_CONSTANTS.START, gameState);
    let userState;
    gameState.players.forEach(player =>{
        console.log(gameState.game_socket_id);
        userState = {
            chips: player.chips,
            hand: player.hand,
            seat: player.seat,
        }
        if(player.user_id === -1){
            io.to(gameState.game_socket_id).emit(GAME_CONSTANTS.DEALER_STATE_UPDATED, {hand: userState.hand});
        }
        else
            io.to(player.sid).emit(GAME_CONSTANTS.START, userState);
    });
    io.to(gameState.game_socket_id).emit(`game:deleteChat:${gameId}`);

    response.status(200).send();
};

module.exports = { method, route, handler };
