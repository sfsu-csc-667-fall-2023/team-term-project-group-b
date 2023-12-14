const { Games, Users } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");
const{emitErrorMessage} = require("../../utils/emit-error-message");
const { emit } = require("process");
const method = "post";
const route = "/:id/hold";

const handler = async (request, response) => {
    const io = request.app.get("io");
    const { id: textGameId } = request.params;
    const { id: userId } = request.session.user;
    const user_socket_id = await Users.getUserSocket(userId);
    const gameId = parseInt(textGameId);
    const potCurrentRound = await Games.getPotForRound(gameId);
    const playerUsername = await Users.getUsername(userId);
    if(potCurrentRound !== 0){
        emitErrorMessage(io, user_socket_id, "You cannot Hold, you must bet");
        response.status(200).send();
        return;
    }
    const isPlayerInGame = await Games.isPlayerInGame(gameId, userId);
    const isPlayerTurn = await Games.checkTurn(gameId, userId);
    if(isPlayerInGame && isPlayerTurn){
        // check if bets have been placed 
        const roundBet = await Games.getMaxBet(gameId);
        if(roundBet !== 0){
            emitErrorMessage(io, user_socket_id, "You cannot hold, you must bet");
            return response.status(200).send();
        }
        const playerSeat = await Games.getPlayerSeat(gameId, userId);
        await Games.updateTurn(gameId, playerSeat);
        const gameState = await Games.getState(gameId);
        emitGameUpdates(io, gameState.game_socket_id, gameState);
        const message = `${playerUsername} held`;
        io.to(gameState.game_socket_id).emit(GAME_CONSTANTS.GAME_ACTION, {message: message});
    }else{
        emitErrorMessage(io, user_socket_id, "It is not your turn")
    }
    
    response.status(200).send();
    
}
    
module.exports = { method, route, handler };