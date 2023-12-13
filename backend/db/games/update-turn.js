const {getUserCount} = require("./get-user-count");
const {updateTurnTable} = require("./update-turn-table");
const {getPlayerBySeat} = require("./get-player-by-seat");

const updateTurn = async(gameId, currentSeat) => {
    const userCount = await getUserCount(gameId);
	const nextSeat = currentSeat + 1;
	if(nextSeat > userCount)
		nextSeat = 1;

    console.log("next Seat:", nextSeat);
	const nextPlayer =  await getPlayerBySeat(gameId, nextSeat);	
    updateTurnTable(gameId, nextPlayer)
    return nextPlayer;
}

module.exports = {updateTurn};
