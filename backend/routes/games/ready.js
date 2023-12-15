const { Games } = require("../../db");
const Check = require("../../utils/index");
const {renderGameState} = require("../../utils/render-game-state");

const method = "post";
const route = "/:id/ready";

const handler = async (request, response) => {
    const io = request.app.get("io");
    const { id: gameId } = request.params;
    const gameState = await Games.initialize(parseInt(gameId));
    renderGameState(io, gameState);
    io.to(gameState.game_socket_id).emit(`game:deleteStart:${gameId}`);

    //testing
    //const winner = Check.checkWinner(gameState.players);
    response.status(200).send();
};

module.exports = { method, route, handler };
