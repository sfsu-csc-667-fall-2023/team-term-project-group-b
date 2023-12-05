const express = require("express");
const { Games } = require("../db");
const router = express.Router();

  router.get("/", async (request, response) => {
        const { id } = request.session.user;
        console.log(request.session.user);
        const currentGames = await Games.getAvailableGames();
        //const currentGames = await Games.currentGamesForUser(id);

        response.render("lobby", { /*availableGames,*/ currentGames, roomId: "global"});
});


module.exports = router;
