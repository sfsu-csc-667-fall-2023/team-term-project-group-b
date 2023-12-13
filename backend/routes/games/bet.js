const { Games, Users } = require("../../db");
const GAME_CONSTANTS = require("../../../constants/games");

const method = "post";
const route = "/:id/bet";

//player enters in amt to bet, mustr match or exceed current bet
//after bet, checks current seat(current player), and cycles
//checks if we are at the end of turn 3
  //at end of turn three, run hand evaluator middleware

const handler = async (request, response) => {
  
}

module.exports = { method, route, handler };