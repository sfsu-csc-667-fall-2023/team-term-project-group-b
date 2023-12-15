const { Games, Users } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");
const {emitErrorMessage} = require("../../utils/emit-error-message");

const method = "post";
const route = "/:id/fold";

const handler = async (request, response) => {
    const io = request.app.get("io");
    const { id: textGameId } = request.params;
    const { id: userId } = request.session.user;
    const gameId = parseInt(textGameId);
    const playerUsername = await Users.getUsername(userId);
    const user_socket_id = await Users.getUserSocket(userId);
    const isPlayerInGame = await Games.isPlayerInGame(gameId, userId);
    const isPlayerTurn = await Games.checkTurn(gameId, userId);

    const isInitialized = await Games.isInitialized(gameId).then(result=> result.initialized);
    if(!isInitialized){
      emitErrorMessage(io, user_socket_id, "Game has not started Yet");
      return response.status(200).send();
    }
    
    if(await Games.getFolded(gameId, userId)){
        emitErrorMessage(io, user_socket_id, "You have already folded");
        return response.status(200).send();
      }

    if(isPlayerInGame && isPlayerTurn){
        
        const playerSeat = await Games.getPlayerSeat(gameId, userId);
        await Games.updateTurn(gameId, playerSeat);
        
        await Games.setFolded(gameId, userId);
        const gameState = await Games.getState(gameId);
        io.to(gameState.game_socket_id).emit(GAME_CONSTANTS.UPDATE_CURRENT_TURN, 
            { username: gameState.current_player_username });
        const message = `${playerUsername} folded`;
        io.to(gameState.game_socket_id).emit(GAME_CONSTANTS.GAME_ACTION, {message: message});
        
    }else{
        emitErrorMessage(io, user_socket_id, "It is not your turn");
    }
  
    return response.status(200).send();
}
    
module.exports = { method, route, handler };