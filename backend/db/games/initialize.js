const { createShuffledDeck } = require("./create-shuffled-deck");
const { getUsers } = require("./get-users");
const { getGame } = require("./get-game");
const { drawCards } = require("./draw-cards");
const { setInitialized } = require("./set-initialized");
const {setGameCards } = require("./set-game-cards");
const {getPlayerBySeat} = require("./get-player-by-seat");
const {setCurrentPlayer} = require("./set-current-player");
const { getUserChips } = require("./get-user-chips");
//const SHUFFLED_DECK = "SELECT *, random() AS rand FROM cards ORDER BY rand";
//const GET_PLAYER_BY_SEAT = "SELECT user_id FROM game_users WHERE seat=$1 AND game_id=$2";
//const GET_CARDS = "SELECT card_id FROM game_cards WHERE game_id=$1 AND user_id=0 ORDER BY card_order LIMIT $2";
//const DEAL_CARD = "UPDATE game_cards SET user_id=$1 WHERE game_id=$2 AND card_id=$3";
//const SET_GAME_CURRENT_PLAYER = "UPDATE games SET current_seat=0 WHERE id=$2";

const initialize = async (gameId) => {
    const {game_socket_id} = await getGame(gameId);
    const firstPlayer = await getPlayerBySeat(gameId, 1).then(({ user_id }) =>
    setCurrentPlayer(gameId, user_id));
    console.log({firstPlayer});
    await createShuffledDeck(gameId);

    const users = await getUsers(gameId)
    const cards = await drawCards(gameId, users.length * 2 + 5 );

    users.push({ user_id: -1 });
    const dealer = users.find(user => user.user_id === -1);
    dealer.hand = [];
    for(let i = 0; i < 5; i++){
      cards[i].user_id = -1;
      dealer.hand.push(cards[i]);
      await setGameCards(gameId, -1, cards[i].card_id);
    }
    let card_index = 5; // game rules
    for(const user of users){
      if(user.user_id !== -1){
        user.hand = [];
        for (let index = card_index; index < card_index + 2; index++) {
          cards[index].user_id = user.user_id;
          user.hand.push(cards[index]);
          await setGameCards(gameId, user.user_id, cards[index].card_id);
        }
        user.chips = await getUserChips(gameId, user.user_id).then(({ chips }) => chips);
        //set the seat
        card_index += 2;
      }
    }
    await setInitialized(gameId);
    return {
      game_id: gameId,
      game_socket_id,
      current_player: firstPlayer,
      players: users,
    };
  };
module.exports = { initialize };