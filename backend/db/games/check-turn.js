const { getPlayerSeat } = require("./get-player-seat");
const {getPlayerBySeat} = require("./get-player-by-seat");

const checkTurn = async(gameId, userId) => {
    const seat = await getPlayerSeat(gameId, userId);
    const currentPlayerId = await getPlayerBySeat(gameId, seat);
    return currentPlayerId == userId;
}

module.exports = {checkTurn};