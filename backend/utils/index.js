const { createHash } = require("crypto");
const { checkHigh }  = require("./checkers/checkHigh");
const { checkTwo }  = require("./checkers/checkTwo");
const { checkThree }  = require("./checkers/checkThree");
const { checkFour }  = require("./checkers/checkFour");
const { checkFlush }  = require("./checkers/checkFlush");
const { checkFull }  = require("./checkers/checkFull");
const { checkRoyal }  = require("./checkers/checkRoyal");
const { checkStraight }  = require("./checkers/checkStraight");
const { checkStraightFlush }  = require("./checkers/checkStraightFlush");
const { checkTwoPair }  = require("./checkers/checkTwoPair");


const emitToChat = (message, userSocketId, io) => {
    io.to(userSocketId).emit(`chat:message`, {
        hash: createHash("sha256").update("Server").digest("hex"),
        from: "Server",
        timestamp: Date.now(),
        message,
    });
};

const evalHand = ( tableCards, playerCards, id ) => {

    const combined = tableCards.concat(playerCards);

    const sorted = combined.sort((a, b) => a.value - b.value);
    
    checkTwo(sorted);

    return {
        //player: id
        //handVal:
        //highCard:
    }
}

const checkWinner = (players, ) => {

    const dealerCards = players.find((player) => player.user_id === -1).hand;

    let currentWinner = {
        winnerId: -1, //default before any hands have been checked
        handVal: 0,     //default val = 0, even highcard val =1, will overwrite
        high: 0,
    };

    players.forEach(player => {
        if(player.user_id != -1){
            const hand = player.hand;
            const id = player.user_id;
            const evaluated = evalHand(dealerCards, hand, id);
        }
    });

    return {
        currentWinner
    }
}

module.exports = {
    emitToChat, checkWinner,
};