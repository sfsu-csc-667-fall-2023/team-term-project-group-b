const database = require("../connection");
const { connection: db } = database;


const GET_STATE = `
  
`;

const getState = async (gameId) => {
    const { game_socket_id } = await getGame(gameId);

    return {
        game_id: gameId,
        game_socket_id,
        current_player,
        players: users,
      };
}

module.exports = { getState };