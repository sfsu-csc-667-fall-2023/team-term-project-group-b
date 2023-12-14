const GAME_CONSTANTS = require("../../constants/games");

function emitGameUpdates(io, game_socket_id, gameState) {
    io.to(game_socket_id).emit(GAME_CONSTANTS.UPDATE_CURRENT_TURN, { username: gameState.current_player_username });
    io.to(game_socket_id).emit(GAME_CONSTANTS.UPDATE_MIN_BET, { bet: gameState.minimumBet });
    io.to(game_socket_id).emit(GAME_CONSTANTS.UPDATE_CURRENT_POT, { pot: gameState.pot });
  }

  module.exports = {emitGameUpdates};