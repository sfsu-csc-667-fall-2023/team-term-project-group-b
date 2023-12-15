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
const { NONAME } = require("dns");


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

    //const test = [{value:6, suit: 0},{value:6, suit: 0},{value:6, suit: 0}, {value:3, suit: 0}, {value:3, suit: 0}]

    //checkFull(test);

    let result;

    result = checkRoyal(sorted);
    if (result.found == 1) {
        return {
            player: id,
            winningHand:"Royal Flush",
            handVal:1,
            highCard: 0,
        }
    }

    result = checkStraightFlush(sorted);
    if (result.found == 1) {
        return {
            player: id,
            winningHand:"Straight Flush",
            handVal:2,
            highCard: 0,
        }
    }

    result = checkFour(sorted);
    if (result.found == 1) {
        return {
            player: id,
            winningHand:"Four of a Kind",
            handVal:3,
            highCard: 0,
        }
    }

    result = checkFull(sorted);
    if (result.found == 1) {
        console.log("Full House Found");
        return {
            player: id,
            winningHand:"Full House",
            handVal:4,
            highCard: 0,
        }
    }

    result = checkFlush(sorted);
    if (result.found == 1) {
        return {
            player: id,
            winningHand:"Flush",
            handVal:5,
            highCard: 0,
        }
    }

    result = checkStraight(sorted);
    if (result.found == 1) {
        return {
            player: id,
            winningHand:"Straight",
            handVal:6,
            highCard: 0,
        }
    }

    result = checkThree(sorted);
    if (result.found == 1) {
        return {
            player: id,
            winningHand:"Three of a Kind",
            handVal:7,
            highCard: 0,
        }
    }

    result = checkTwoPair(sorted);
    if (result.found == 1) {
        return {
            player: id,
            winningHand:"Two Pair",
            handVal:8,
            highCard: 0,
        }
    }
    
    result = checkTwo(sorted);
    if (result.found == 1) {
        return {
            player: id,
            winningHand:"Pair",
            handVal:9,
            highCard: 0,
        }
    }

    result = checkHigh(sorted);
    if (result.found == 1) {
        return {
            player: id,
            winningHand:"High Card",
            handVal:10,
            rank:result.high,
            highCard: 0,
        }
    }
    return {
        player: id,
        winningHand:"-1",
        handVal:11,
        rank: -1,
        highCard: 0,
    }

}

const checkWinner = (players, ) => {

    const dealerCards = players.find((player) => player.user_id === -1).hand;

    let currentWinner = {
        winnerId: -1, //default before any hands have been checked
        handVal: 12,     //default val = 12, even highcard val =1, will overwrite
        rank: -1, 
        winningHand: "",
        high: 0,
    };

    players.forEach(player => {
        if(player.user_id != -1){
            const hand = player.hand;
            const id = player.user_id;
            const evaluated = evalHand(dealerCards, hand, id);
            console.log(evaluated);
            if( evaluated.handVal < currentWinner.handVal) {
                currentWinner.winnerId = evaluated.player;
                currentWinner.handVal = evaluated.handVal;
                currentWinner.winningHand = evaluated.winningHand;

            } else if (evaluated.handVal == currentWinner.handVal) {
                if(evaluated.handVal = 9) {     //in case of pair handle this way
                    /*if (evaluated.rank == ) {

                    }*/
                }
                if(evaluated.high == currentWinner.high) {

                }
                /*if (evaluated.rank == ) {

                }*/
                //pairRank:
                //check high
            }
        }
    });

    return {
        currentWinner
    }
}

module.exports = {
    emitToChat, checkWinner,
};