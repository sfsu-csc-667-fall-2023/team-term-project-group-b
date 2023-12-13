const { createShuffledDeck } = require("./create-shuffled-deck");
const { getUsers } = require("./get-users");
const { getGame } = require("./get-game");
const { drawCards } = require("./draw-cards");
const { setInitialized } = require("./set-initialized");
const {setGameCards } = require("./set-game-cards");
const {getPlayerBySeat} = require("./get-player-by-seat");
const {setCurrentPlayer} = require("./set-current-player");
const { getUserChips } = require("./get-user-chips");
const { getPlayerSeat } = require("./get-player-seat");

const initialize = async (gameId) => {
    const {game_socket_id} = await getGame(gameId);
    const firstPlayer = await getPlayerBySeat(gameId, 1).then(user_id  =>
      setCurrentPlayer(gameId, user_id));


    await createShuffledDeck(gameId);
    const users = await getUsers(gameId)
    const cards = await drawCards(gameId, users.length * 2 + 3 );

    users.push({ user_id: -1 });

    const dealer = users.find(user => user.user_id === -1);

    dealer.hand = [];

    for(let i = 0; i < 3; i++){
      cards[i].user_id = -1;
      dealer.hand.push(cards[i]);
      await setGameCards(gameId, -1, cards[i].card_id);
    }

    let card_index = 3; // game rules

    for(const user of users){
      if(user.user_id !== -1){
        user.hand = [];
        for (let index = card_index; index < card_index + 2; index++) {
          cards[index].user_id = user.user_id;
          user.hand.push(cards[index]);
          await setGameCards(gameId, user.user_id, cards[index].card_id);
        }
        user.chips = await getUserChips(gameId, user.user_id);
        user.seat = await getPlayerSeat(gameId, user.user_id);
        card_index += 2;
      }
    }
    console.log(users);
    await setInitialized(gameId);

    return {
      game_id: gameId,
      game_socket_id,
      current_player: firstPlayer,
      players: users,
    };

  };
module.exports = { initialize };