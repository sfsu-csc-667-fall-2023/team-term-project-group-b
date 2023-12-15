const { Games, Users } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");
const {emitGameUpdates} = require("../../utils/emit-game-updates");
const {emitErrorMessage} = require("../../utils/emit-error-message");

const method = "post";
const route = "/:id/call";

const handler = async (request, response) => {
    const io = request.app.get("io");
    const { id: textGameId } = request.params;
    const { id: userId } = request.session.user;
    const gameId = parseInt(textGameId);

    let playerChips = await Games.getUserChips(gameId, userId);
    const playerUsername = await Users.getUsername(userId);
    const user_socket_id = await Users.getUserSocket(userId);
    let maxBetRound = await Games.getMaxBet(gameId);
    const isPlayerInGame = await Games.isPlayerInGame(gameId, userId);
    const isPlayerTurn = await Games.checkTurn(gameId, userId);
    let bet;
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
        bet = playerChips < maxBetRound ?  playerChips : maxBetRound;
        await completeCall (gameId, userId, playerChips, bet);
        
        const playerSeat = await Games.getPlayerSeat(gameId, userId);
        await Games.updateTurn(gameId, playerSeat);
        
        const gameState = await Games.getState(gameId);
        emitGameUpdates(io, gameState.game_socket_id, gameState);
        io.to(user_socket_id).emit(GAME_CONSTANTS.UPDATE_PLAYER_CHIPS, {chips: playerChips - bet});
        const message = `${playerUsername} bet ${bet} chips`
        io.to(gameState.game_socket_id).emit(GAME_CONSTANTS.GAME_ACTION, {message: message});
        
    }else{
        emitErrorMessage(io, user_socket_id, "It is not your turn")
    }
}

async function completeCall (gameId, userId, playerChips, bet){
    playerChips = playerChips - bet;
    let updatedPot = await Games.getPot(gameId);
    updatedPot = updatedPot + bet;
    await Games.updatePlayerChips(gameId, userId, playerChips);
    await Games.updatePot(gameId, updatedPot);
}
    
module.exports = { method, route, handler };