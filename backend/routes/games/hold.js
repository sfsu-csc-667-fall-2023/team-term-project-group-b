const { Games, Users } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");
const{emitErrorMessage} = require("../../utils/emit-error-message");
const{emitGameUpdates} = require("../../utils/emit-game-updates");

const method = "post";
const route = "/:id/hold";

const handler = async (request, response) => {
    const io = request.app.get("io");
    const { id: textGameId } = request.params;
    const { id: userId } = request.session.user;
    const user_socket_id = await Users.getUserSocket(userId);
    const gameId = parseInt(textGameId);
    const isPlayerInGame = await Games.isPlayerInGame(gameId, userId);
    const isPlayerTurn = await Games.checkTurn(gameId, userId);
    const playerUsername = await Users.getUsername(userId);

    const isInitialized = await Games.isInitialized(gameId).then(result=> result.initialized);
    if(!isInitialized){
      emitErrorMessage(io, user_socket_id, "Game has not started Yet");
      response.status(200).send();
    }

    if(await Games.getFolded(gameId, userId)){
        emitErrorMessage(io, user_socket_id, "You have already folded");
        return response.status(200).send();
      }

    if(isPlayerInGame && isPlayerTurn){
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

        // check round
    }else{
        emitErrorMessage(io, user_socket_id, "It is not your turn")
    }
    
    response.status(200).send();
    
}
    
module.exports = { method, route, handler };