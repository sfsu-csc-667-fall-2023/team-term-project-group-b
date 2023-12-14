const { Games, Users } = require("../../db");
const { isInitialized } = require("../../db/games");

const method = "get";
const route = "/:id";

const handler = async (request, response) => {
    const {id: gameId} = request.params;
    const{id: userId, username} = request.session.user;

    const gameSocketId= await Games.getGameSocket(gameId);
    const userSocketId = await Users.getUserSocket(userId);

    const result = await isInitialized(gameId);
    
    response.render("game", {id: gameId, gameSocketId, userSocketId, roomId: gameId, is_initialized: result});
};

module.exports = { method, route, handler };