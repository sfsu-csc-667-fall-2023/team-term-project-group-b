const { createHash } = require("crypto");


const emitToChat = (message, userSocketId, io) => {
    io.to(userSocketId).emit(`chat:message`, {
        hash: createHash("sha256").update("Server").digest("hex"),
        from: "Server",
        timestamp: Date.now(),
        message,
    });
};

const sortCards = ( tableCards, playerCards ) => {

    return{
        //sorted cards
    }
}

const evalHand = ( tableCards, playerCards ) => {

    const sorted = sortCards( tableCards, playerCards );

    return {
        //player: 
        //handVal:
    }
}

const checkWinner = ( gameSocketId, players, ) => {
    const dealerCards = players.find((player) => player.user_id === -1).hand;
    let currentWinner = {
        winnerId: -1, //default before any hands have been checked
        handVal: 0,     //default val = 0, even highcard val =1, will overwrite
        high: 0,
    };

    players.forEach(player => {
        if(player.user_id != -1){
            const hand = player.hand;
            const evaluated = evalHand(dealerCards, hand);
        }
    });

    return {
        currentWinner
    }
}


module.exports = {
    emitToChat, checkWinner,
};