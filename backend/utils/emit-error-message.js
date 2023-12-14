const GAME_CONSTANTS = require("../../constants/games");

function emitErrorMessage(io, user_socket_id, message){
    io.to(user_socket_id).emit(GAME_CONSTANTS.ERROR_MESSAGE, {message: message})
    }

module.exports = {emitErrorMessage};