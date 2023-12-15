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
const { getUsername } = require("../users");
const {wipeCards} = require("./wipe-game-cards");
const {resetCalled} = require("./reset-users-called");
const {updateAllFoldedFalse} = require("./set-all-folded-false");
const { updateTurnTable } = require("./update-turn-table");
const { resetMaxBet } = require("./reset-max-bet");
const { updateRound } = require("./update-round");
const reInitialize = async (gameId) => {
  
    const {game_socket_id} = await getGame(gameId);
    const firstPlayer = await getPlayerBySeat(gameId, 1).then(user_id  =>
      setCurrentPlayer(gameId, user_id));
    await wipeCards(gameId);
    await updateTurnTable(gameId, firstPlayer["turn"]);
    const currentUserName = await getUsername(firstPlayer["turn"]);
    
    await createShuffledDeck(gameId);
    const users = await getUsers(gameId)
    await resetCalled(gameId);
    await updateRound(gameId, 1);
    await updateAllFoldedFalse(gameId);
    const cards = await drawCards(gameId, users.length * 2 + 3 );
    
    users.push({ user_id: -1 });
    const dealer = users.find(user => user.user_id === -1);
    dealer.hand = [];
    for(let i = 0; i < 3; i++){
      cards[i].user_id = -1;
      dealer.hand.push(cards[i]);
      await setGameCards(gameId, -1, cards[i].card_id);
    }

    let card_index = 3;

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
   
    await setInitialized(gameId);
    await resetMaxBet(gameId);
    return {
      game_id: gameId,
      game_socket_id,
      current_player: firstPlayer,
      current_player_username: currentUserName,
      players: users,
      };

  };
module.exports = { reInitialize };