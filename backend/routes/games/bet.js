const { Games, Users } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");
const {emitGameUpdates} = require("../../utils/emit-game-updates");
const{emitSucessPlayerAction} = require("../../utils/emit-sucessful-action");
const{emitErrorMessage} = require("../../utils/emit-error-message");
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

    const user_socket_id = await Users.getUserSocket(userId);
    let playerChips = await Games.getUserChips(gameId, userId);
    const maxBetRound = await Games.getMaxBet(gameId);
    const isPlayerInGame = await Games.isPlayerInGame(gameId, userId);
    const isPlayerTurn = await Games.checkTurn(gameId, userId);

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
      emitSucessPlayerAction(io, user_socket_id, `You Bet: ${betAmount}`);
      io.to(user_socket_id).emit(GAME_CONSTANTS.UPDATE_PLAYER_CHIPS, {chips: playerChips - betAmount});

      //////check round
      
      //////      
    }
    
    response.status(200).send();
}


async function completeBetting (gameId, userId, playerChips, betAmount, io){
      playerChips = playerChips - betAmount;
      let updatedPot = await Games.getPot(gameId);
      updatedPot = updatedPot + betAmount;
      await Games.updatePlayerChips(gameId, userId, playerChips);
      await Games.updatePot(gameId, updatedPot);
      await Games.updateMaxBetRound(gameId, betAmount + 20);
}

function validateBet(user_socket_id, betAmount, playerChips, maxBetRound, io){
    const hasEnoughChips = betAmount <= playerChips;
    let valid = true;
    if(!hasEnoughChips){
      emitErrorMessage(io, user_socket_id, "Not enough chips to place the bet");
      valid = false;
  }
    const isValidBet = (betAmount >= maxBetRound) || (betAmount == playerChips) //all in: valid
    if(!isValidBet){
      emitErrorMessage(io, user_socket_id, `Bet must be higher than: ${maxBetRound}`);
      valid = false;
    }
    return valid
  }
module.exports = { method, route, handler };