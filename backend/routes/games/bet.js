const { Games, Users } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");

const method = "post";
const route = "/:id/bet";

const handler = async (request, response) => {
  const io = request.app.get("io");
    const { id: textGameId } = request.params;
    let {formDataObject} = request.body;
    const textBetAmout = formDataObject['bet-amount'];
    const { id: userId } = request.session.user;
    const gameId = parseInt(textGameId);
    const betAmount = parseInt(textBetAmout);
    let playerChips = await Games.getUserChips(gameId, userId);
    const maxBetRound = await Games.getMaxBetRound(gameId);
    const isValidBet = betAmount <= playerChips && betAmount >= maxBetRound;
    if(!isValidBet){
      //emit to chat?
        console.log("invalid, you have: ", playerChips, 'bet: s', betAmount);
        return response.status(200).send();
    }
    const isPlayerInGame = await Games.isPlayerInGame(gameId, userId);
    const isPlayerTurn = await Games.checkTurn(gameId, userId);
    if(isPlayerInGame && isPlayerTurn){
      completeBetting(gameId, userId, playerChips, betAmount, io);

      const playerSeat = await Games.getPlayerSeat(gameId, userId);
      await Games.updateTurn(gameId, playerSeat);

      const user_socket_id = await Users.getUserSocket(userId);
      const game_socket_id = await Games.getGameSocket(gameId);
      //io.to(game_socket_id).emit(GAME_CONSTANTS.)
    }
    response.status(200).send();
}
async function completeBetting (gameId, userId, playerChips, betAmount, io){
  playerChips = playerChips - betAmount;
      let updatedPot = await Games.getPot(gameId);
      updatedPot = updatedPot + betAmount;
      console.log("testing", updatedPot);
      await Games.updatePlayerChips(gameId, userId, playerChips);
      await Games.updatePot(gameId, updatedPot);
      await Games.updateMaxBetRound(gameId, betAmount);

      const user_socket_id = await Users.getUserSocket(userId);
      const game_socket_id = await Games.getGameSocket(gameId);

      io.to(user_socket_id).emit(GAME_CONSTANTS.UPDATE_PLAYER_POT, playerChips);
      io.to(game_socket_id).emit(GAME_CONSTANTS.UPDATE_MIN_BET, betAmount);
      io.to(game_socket_id).emit(GAME_CONSTANTS.UPDATE_CURRENT_POT, updatedPot);
}

module.exports = { method, route, handler };