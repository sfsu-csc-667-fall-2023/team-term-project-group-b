const { Games, Users } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");
const {emitToChat} = require("../../utils");

const method = "post";
const route = "/:id/bet";

const handler = async (request, response) => {
  const io = request.app.get("io");
    const { id: textGameId } = request.params;
    const textBetAmout = request.body['bet-amount'];
    const { id: userId } = request.session.user;
    const user_socket_id = await Users.getUserSocket(userId);
    const gameId = parseInt(textGameId);
    const betAmount = parseInt(textBetAmout);
    const isPlayerInGame = await Games.isPlayerInGame(gameId, userId);
    const isPlayerTurn = await Games.checkTurn(gameId, userId);
    // check if bets have been placed 
    if(isPlayerInGame && isPlayerTurn){
        const playerSeat = await Games.getPlayerSeat(gameId, userId);
        const nextPlayer = await Games.updateTurn(gameId, playerSeat);
    }
    response.status(200).send();
}

module.exports = { method, route, handler };