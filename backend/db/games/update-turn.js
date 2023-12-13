const {getUserCount} = require("./get-user-count");
const {updateTurnTable} = require("./update-turn-table");
const {getPlayerBySeat} = require("./get-player-by-seat");

const updateTurn = async(gameId, currentSeat) => {
    const userCount = await getUserCount(gameId);
	let nextSeat = currentSeat + 1;
	if(nextSeat > userCount)
		nextSeat = 1;

    console.log("next Seat:", nextSeat, "count", userCount);
	const nextPlayer =  await getPlayerBySeat(gameId, nextSeat);	
    const t = await updateTurnTable(gameId, nextPlayer)
    console.log("update, next turn id:", t);
    return nextPlayer;
}

module.exports = {updateTurn};
