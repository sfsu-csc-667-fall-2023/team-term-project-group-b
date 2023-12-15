const express = require("express");
const { Games } = require("../db");
const router = express.Router();

router.get("/", async (request, response) => {
        const { id } = request.session.user;
        const currentGames = await Games.getAvailableGames();
        response.render("lobby", {currentGames, roomId: "global"});
});

module.exports = router;
