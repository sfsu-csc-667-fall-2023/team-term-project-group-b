const { getPlayerSeat } = require("./get-player-seat");
const {grabPlayerBySeat} = require("./get-player-by-seat");

const checkTurn = async(gameId, userId) => {
    const playerSeat = await getPlayerSeat(gameId, userId);
    const currentPlayerId = await grabPlayerBySeat(gameId, playerSeat);
    return currentPlayerId == userId;
}

module.exports = {checkTurn};