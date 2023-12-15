const {getUserCount} = require("./get-user-count");
const {updateTurnTable} = require("./update-turn-table");
const {getPlayerBySeat} = require("./get-player-by-seat");
const {getFolded} = require("./get-folded");
const updateTurn = async(gameId, currentSeat) => {
	const userCount = await getUserCount(gameId);
	let nextSeat = currentSeat + 1;
	let isNextPlayerOut;
	let nextPlayer;
	do{
		if(nextSeat > userCount)
			nextSeat = 1;
		nextPlayer =  await getPlayerBySeat(gameId, nextSeat);
		isNextPlayerOut = await getFolded(gameId, nextPlayer);
		nextSeat = nextSeat + 1;
		console.log(nextPlayer,isNextPlayerOut, nextSeat);
		}while(isNextPlayerOut);
    await updateTurnTable(gameId, nextPlayer)
    return nextPlayer;
}

module.exports = {updateTurn};
