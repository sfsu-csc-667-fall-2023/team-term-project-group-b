const { getPlayerSeat } = require("./get-player-seat");
const {getPlayerBySeat} = require("./get-player-by-seat");
const { getCurrentTurn } = require("./get-current-turn");

const checkTurn = async(gameId, userId) => {
    const seat = await getPlayerSeat(gameId, userId);
    const currentPlayerId = await getPlayerBySeat(gameId, seat);
    const currentTurn = await getCurrentTurn(gameId);
    console.log("player making move id:", currentPlayerId, "id of actual turn: ",currentTurn);
    return currentPlayerId == currentTurn;
}

module.exports = {checkTurn};