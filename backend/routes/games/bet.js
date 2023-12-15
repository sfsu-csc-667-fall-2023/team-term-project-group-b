const { Games, Users } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");
const {emitGameUpdates} = require("../../utils/emit-game-updates");
const {emitErrorMessage} = require("../../utils/emit-error-message");
const method = "post";
const route = "/:id/bet";

const handler = async (request, response) => {
    const io = request.app.get("io");
    const { id: textGameId } = request.params;
    let {formDataObject} = request.body;
    const { id: userId } = request.session.user;
    const textBetAmout = formDataObject['bet-amount'];
    const gameId = parseInt(textGameId);
    const betAmount = parseInt(textBetAmout);
    
    let playerChips = await Games.getUserChips(gameId, userId);
    const playerUsername = await Users.getUsername(userId);
    const user_socket_id = await Users.getUserSocket(userId);
    const isInitialized = await Games.isInitialized(gameId).then(result=> result.initialized);
    if(!isInitialized){
      emitErrorMessage(io, user_socket_id, "Game has not started Yet");
      return response.status(200).send();
    }
    const maxBetRound = await Games.getMaxBet(gameId);
    const isPlayerInGame = await Games.isPlayerInGame(gameId, userId);
    const isPlayerTurn = await Games.checkTurn(gameId, userId);

    if(await Games.getFolded(gameId, userId)){
      emitErrorMessage(io, user_socket_id, "You have already folded");
      return response.status(200).send();
    }

    if(isPlayerInGame && isPlayerTurn){
      const valid = validateBet(user_socket_id, betAmount, playerChips, maxBetRound, io);
      if(!valid){
        return response.status(200).send();
      }
      await completeBetting(gameId, userId, playerChips, betAmount, io);
      const playerSeat = await Games.getPlayerSeat(gameId, userId);
      await Games.updateTurn(gameId, playerSeat);

      const gameState = await Games.getState(gameId);
      emitGameUpdates(io, gameState.game_socket_id, gameState);
      io.to(user_socket_id).emit(GAME_CONSTANTS.UPDATE_PLAYER_CHIPS, {chips: playerChips - betAmount});
      const message = `${playerUsername} bet ${betAmount} chips`
      io.to(gameState.game_socket_id).emit(GAME_CONSTANTS.GAME_ACTION, {message: message});

      await Games.updateGameLoop(gameId, userId); 
    }else{
      emitErrorMessage(io, user_socket_id, "It is not your turn");
    }
    
    return response.status(200).send();
}


async function completeBetting (gameId, userId, playerChips, betAmount){
      playerChips = playerChips - betAmount;
      let updatedPot = await Games.getPot(gameId);
      updatedPot = updatedPot + betAmount;
      await Games.updatePlayerChips(gameId, userId, playerChips);
      await Games.updatePot(gameId, updatedPot);
      await Games.updateMaxBetRound(gameId, betAmount + GAME_CONSTANTS.ADD_MIN);
      await Games.setCalled(gameId, userId);

}

function validateBet(user_socket_id, betAmount, playerChips, maxBetRound, io){
    const hasEnoughChips = betAmount <= playerChips;
    if(!hasEnoughChips){
      emitErrorMessage(io, user_socket_id, "Not enough chips to place the bet");
      return false;
  }
    const isValidBet = (betAmount >= maxBetRound) || (betAmount == playerChips) //all in: valid
    if(!isValidBet){
      emitErrorMessage(io, user_socket_id, `Bet must be higher than: ${maxBetRound}`);
      return false;
    }
    return true;
  }
module.exports = { method, route, handler };