const { Games, Users } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");

const method = "get";
const route = "/:id/join";

const handler = async (request, response) => {
    const { id: gameId } = request.params;
  const { id: userId } = request.session.user;
  const result = await isInitialized(gameId);
  const gameUsers = await Games.usersInGame(gameId);
  const userInGameAlready = gameUsers.some((user) => user.user_id === userId);
    if(result.initialized && !userInGameAlready){
      response.status(403).redirect("/lobby");
    }
    else{
    if (!userInGameAlready) {
      await Games.addUser(gameId, userId);
      await Games.readyPlayer(userId, gameId);
      await Games.setUserChips(gameId, userId);
    }
  response.redirect(`/game/${gameId}`);
  }
};

module.exports = { method, route, handler };