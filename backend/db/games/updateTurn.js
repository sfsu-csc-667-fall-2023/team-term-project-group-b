const {getUserCount} = require("../games");
const {updateTurn} = require("../games");
const {grabPlayerBySeat} = require("./get-player-by-seat");

const updateTurn = async(gameId, currentSeat) => {
    const userCount = await getUserCount(gameId);
	const nextSeat = currentSeat + 1;
	if(nextSeat > userCount)
		nextSeat = 1;
	const nextPlayer =  await grabPlayerBySeat(gameId, nextSeat);	
    Games.updateTurn(gameId, nextPlayer)
    return nextPlayer;
}

module.exports = {updateTurn};
