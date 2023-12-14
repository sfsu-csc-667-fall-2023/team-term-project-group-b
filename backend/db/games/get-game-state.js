const database = require("../connection");
const { connection: db } = database;

const { getCards } = require("./get-cards");
const { getPlayerBySeat } = require("./get-player-by-seat");
const { getCurrentTurn } = require("./get-current-turn");
const { getGame } = require("./get-game");
const { getUsers } = require("./get-users");

const getState = async (gameId) => {
  const { game_socket_id } = await getGame(gameId);
  const current_turn =  await getCurrentTurn(gameId);
  const current_player = await getPlayerBySeat(gameId, current_turn);

  const currentUserName = await getCurrentUsername(current_player["turn"]); //check
  
  const users = await getUsers(gameId);
  const dealtCards = await getCards(gameId);
  console.log({ dealtCards });

  users.forEach((user) => {
    console.log({ user });
    user.hand = dealtCards.filter((card) => card.user_id === user.user_id);
    user.current_player = current_player === user.user_id;
  });

  return {
    game_id: gameId,
    game_socket_id,
    current_player,
    current_player_username: currentUserName,
    players: users,
  };
};

module.exports = { getState };