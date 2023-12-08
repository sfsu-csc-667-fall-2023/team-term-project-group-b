const { createShuffledDeck } = require("./create-shuffled-deck");
const { getUsers } = require("./get-users");
//const { getGame } = require("./get-game");
const { getPlayerBySeat } = require("./get-player-by-seat");
const { setCurrentPlayer } = require("./set-current-player");
const { drawCards } = require("./draw-cards");
//const { dealCards } = require("./deal-cards");
//const { setInitialized } = require("./set-initialized");

const database = require("../connection");
const { connection: db, pgp} = database;


//const SHUFFLED_DECK = "SELECT *, random() AS rand FROM cards ORDER BY rand";
//const GET_PLAYER_BY_SEAT = "SELECT user_id FROM game_users WHERE seat=$1 AND game_id=$2";
//const GET_CARDS = "SELECT card_id FROM game_cards WHERE game_id=$1 AND user_id=0 ORDER BY card_order LIMIT $2";
//const DEAL_CARD = "UPDATE game_cards SET user_id=$1 WHERE game_id=$2 AND card_id=$3";
//const SET_GAME_CURRENT_PLAYER = "UPDATE games SET current_seat=0 WHERE id=$2";

const initialize = async (gameId) => {
    //const { game_socket_id } = await getGame(gameId);

    await createShuffledDeck(gameId);   //shuffeled deck will be on DB

    /*const firstPlayer = await getPlayerBySeat(1, gameId).then(({ user_id }) =>
        setCurrentPlayer(user_id, gameId),
    );*/

    const users = await getUsers(gameId);       //before we add dealer(hole cards)
    //console.log({users})

    const cards = await drawCards(gameId, users.length * 2 + 5 );   //draws the correct amt for holdem

    //console.log({cards});
    users.push({ user_id: -1 }); // TODO: add game sid here     //this is dealer
    //foreach(user) -> dealCards(gameId, useId, 2)

    /*if (userId > 0 ) {
      //give 2 cards
    } else if (userId = -1) {
      //give 5 cards
    }*/

    //console.log({users});
    //console.log({cards});

    //foreach(user) -> dealCards(gameId, useId, 2)
    //dealCards(gameId, -1, 5);
    //
    

    //const dealtCards = await dealCards(users, cards, gameId);
    //console.log({ dealtCards });
    
    //deal cards
    /*const users = await db
      .many(GET_GAME_USERS, [gameId])   //
      .then((userResult) => {
        console.log({ userResult });
  
        return userResult;
      })
      .then((userResult) =>
        Promise.all([
          userResult,
          ...userResult.map(({ user_id }) =>
            Users.getUserSocket(parseInt(user_id)),
          ),
        ]),
      )
      .then(([userResult, ...userSids]) =>
        userResult.map(({ user_id }, index) => ({
          user_id,
          sid: userSids[index].sid,
        })),
      );
  
    const cards = await db.many(GET_CARDS, [gameId, users.length * 2 + 2]);
    await Promise.all(
      cards
        .slice(0, cards.length - 2)
        .map(({ card_id }, index) =>
          db.none(DEAL_CARD, [
            users[index % users.length].user_id,
            gameId,
            card_id,
          ]),
        ),
    );
    await Promise.all(
      cards
        .slice(cards.length - 2)
        .map(({ card_id }) => db.none(DEAL_CARD, [-1, gameId, card_id])),
    );
    const hands = await db.many(
      "SELECT game_cards.*, cards.* FROM game_cards, cards WHERE game_id=$1 AND game_cards.card_id=cards.id",
      [gameId],
    );*/
    //console.log({ hands });
    //const {game_socket_id} = await getGameSocket(gameId);
    return {
      //current_player: firstPlayer,
      /*hands: hands.reduce((memo, entry) => {
        if (entry.user_id !== 0) {
          memo[entry.user_id] = memo[entry.user_id] || [];
          memo[entry.user_id].push(entry);
        }
  
        return memo;
      }, {}),*/
    };
}

module.exports = { initialize };