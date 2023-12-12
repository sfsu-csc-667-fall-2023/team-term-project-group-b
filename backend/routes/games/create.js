const { Games, Users } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");

const crypto = require("crypto");

const method = "get";
const route = "/create";

const handler = async (request, response) => {
    const { id: userId } = request.session.user;  
    const io = request.app.get("io");
    
    const { id: gameId } = await Games.create(
        crypto.randomBytes(20).toString('hex')
    );

    await Games.addUser(gameId, userId);
    await Games.createGameState(gameId, 1, 1, 1, 0); //id, round, turn, player count, pot 
    await Games.setUserChips(gameId, userId);
    await Games.readyPlayer(userId, gameId);

    io.emit(GAME_CONSTANTS.CREATED, { id: gameId, createdBy: userId});
    response.redirect(`/game/${gameId}`);
};

module.exports = { method, route, handler };