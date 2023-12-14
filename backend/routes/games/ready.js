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
            io.to(player.sid).emit(GAME_CONSTANTS.UPDATE_PLAYER_CHIPS, {chips: userState.chips});
    });


    io.to(gameState.game_socket_id).emit(GAME_CONSTANTS.UPDATE_ROUND, {round:1});
    io.to(gameState.game_socket_id).emit(GAME_CONSTANTS.UPDATE_CURRENT_POT, {pot:0});
    io.to(gameState.game_socket_id).emit(GAME_CONSTANTS.UPDATE_CURRENT_TURN, {username: gameState.current_player_username});
    io.to(gameState.game_socket_id).emit(GAME_CONSTANTS.UPDATE_MIN_BET, {bet:0});
    io.to(gameState.game_socket_id).emit(`game:deleteStart:${gameId}`);

    response.status(200).send();
};

module.exports = { method, route, handler };
