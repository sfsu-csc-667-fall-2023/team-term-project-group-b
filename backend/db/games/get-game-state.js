const database = require("../connection");
const { connection: db } = database;

const { getCards } = require("./get-cards");
const { getCurrentTurn } = require("./get-current-turn");
const { getGame } = require("./get-game");
const { getUsers } = require("./get-users");
const { getUsername } = require("../users");
const { getRound } = require("./get-round");
const { getPot } = require("./get-pot");
const {getMaxBet} = require("./get-max-bet");
const {getDealerHand} = require("./get-dealer-hand");

const getState = async (gameId) => {
  const { game_socket_id } = await getGame(gameId);
  const current_player =  await getCurrentTurn(gameId);
  const currentUserName = await getUsername(current_player);
  const users = await getUsers(gameId);
  const dealtCards = await getCards(gameId);
  const dealerHand = await getDealerHand(gameId);
  users.forEach((user) => {
    user.hand = dealtCards.filter((card) => card.user_id === user.user_id);
    user.current_player = current_player === user.user_id;
    if(user.user_id === -1){
      dealerHand = user.hand;
    }
  });
  const round = await getRound(gameId);
  const gamePot = await getPot(gameId);
  console.log(gamePot);
  const minimumBet = await getMaxBet(gameId);
  return {
    game_id: gameId,
    game_socket_id,
    current_player,
    current_player_username: currentUserName,
    players: users,
    round,
    pot: gamePot,
    minimumBet,
    dealerHand,
  };
};

module.exports = { getState };