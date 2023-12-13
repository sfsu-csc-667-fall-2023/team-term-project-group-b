const { createHash } = require("crypto");


const emitToChat = (message, userSocketId, io) => {
    io.to(userSocketId).emit(`chat:message`, {
        hash: createHash("sha256").update("Server").digest("hex"),
        from: "Server",
        timestamp: Date.now(),
        message,
    });
};

module.exports = {
    emitToChat,
};