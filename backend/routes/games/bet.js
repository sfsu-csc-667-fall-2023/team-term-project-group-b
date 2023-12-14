const { Games, Users } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");
const {emitToChat} = require("../../utils");

const method = "post";
const route = "/:id/bet";

const handler = async (request, response) => {
  const io = request.app.get("io");
    const { id: textGameId } = request.params;
    let textBetAmout = request.body['bet-form'];
    // is undefined?
    console.log(request.body);
    const { id: userId } = request.session.user;
    const user_socket_id = await Users.getUserSocket(userId);
    const gameId = parseInt(textGameId);
    const betAmount = parseInt(textBetAmout);
    const playerChips = await Games.getUserChips(gameId, userId);
    console.log(betAmount, playerChips);
    if(betAmount > playerChips){
        //not working: emitToChat("Not enough chips", user_socket_id, io);
        response.status(200).send();
    }
    const isPlayerInGame = await Games.isPlayerInGame(gameId, userId);
    const isPlayerTurn = await Games.checkTurn(gameId, userId);
    if(isPlayerInGame && isPlayerTurn){

      //update Turn
      const playerSeat = await Games.getPlayerSeat(gameId, userId);
      await Games.updateTurn(gameId, playerSeat);
    }
    response.status(200).send();
}

module.exports = { method, route, handler };