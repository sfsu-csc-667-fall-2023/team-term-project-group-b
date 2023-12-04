const express = require("express");
const crypto = require("crypto");
const router = express.Router();

const { Games, Users } = require("../db");

router.get("/create" , async (request, response) => {
    const { id: userId } = request.session.user;
    const io = request.app.get("io");

    const { id: gameId } = await Games.create(
        crypto.randomBytes(20).toString('hex')
    );        //unique game id created here
    //console.log(userId + " - user id");
    //console.log(gameId + " - game id");
    await Games.addUser(userId, gameId);


    io.emit("game:created", { id: gameId });

    response.redirect(`/game/${gameId}`);
})

router.get("/:id/join", async (request, response) => {
    const { id: gameId } = request.params;
    const { id: userId, email: userEmail } = request.session.user;
    const io = request.app.get("io");

    await Games.addUser(userId, gameId);
    io.emit("game:user_added", { userId, userEmail, gameId });

    response.redirect(`/game/${gameId}`);
  });

router.get("/:id", async (request, response) => {
    const {id} = request.params;
    const{ game_socket_id: gameSocketId } = await Games.getGame(id);
    response.render("game", {id, gameSocketId});
    //response.render("game", {gameId : id, roomId: id });
});

module.exports = router;
