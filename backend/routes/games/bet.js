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
    const user_socket_id = await Users.getUserSocket(userId);
    const gameId = parseInt(textGameId);
    const betAmount = parseInt(textBetAmout);
    let playerChips = await Games.getUserChips(gameId, userId);
    console.log(betAmount, playerChips);
    if(betAmount > playerChips){
      //emit to chat?
        return response.status(200).send();
    }
    const isPlayerInGame = await Games.isPlayerInGame(gameId, userId);
    const isPlayerTurn = await Games.checkTurn(gameId, userId);
    if(isPlayerInGame && isPlayerTurn){
      completeBetting(gameId, userId, playerChips, betAmount);

      const playerSeat = await Games.getPlayerSeat(gameId, userId);
      await Games.updateTurn(gameId, playerSeat);
      // emit to game socket: next seat
    }
    response.status(200).send();
}
async function completeBetting (gameId, userId, playerChips, betAmount){
  playerChips = playerChips - betAmount;
      let updatedPot = await Games.getPot(gameId);
      updatedPot = updatedPot + betAmount;
      console.log("testing", updatedPot);
      await Games.updatePlayerChips(gameId, userId, playerChips);
      await Games.updatePot(gameId, updatedPot);
      // emit to user socket: updated chips 
      //emit to game socket: updatedPot
}

module.exports = { method, route, handler };