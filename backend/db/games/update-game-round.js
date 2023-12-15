const {getPlayerActionCount} = require("./get-player-action-count");
const {getPlayerInGameCount} = require("./get-ingame-count");
const {getRound} = require("./get-round");
const {updateRound} = require("./update-round");
const database = require("../connection");


const updateGameRound = async(gameId) =>{
    const playerActionCount = await getPlayerActionCount(gameId);
    const playersAlive = await getPlayerInGameCount(gameId);
    if(playerActionCount == playersAlive){
        let round = await getRound(gameId);
        round = round + 1;
        updateRound(gameId, round);
        return true;
    }
    return false;
}

module.exports = {updateGameRound};