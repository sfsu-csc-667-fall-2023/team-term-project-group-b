const GAME_CONSTANTS = require("../../constants/games");

function emitSucessPlayerAction(io, user_socket_id, message){
      io.to(user_socket_id).emit(GAME_CONSTANTS.SUCCESSFUL_PLAYER_ACTION_MESSAGE, 
      {message: message});

}

module.exports = {emitSucessPlayerAction};