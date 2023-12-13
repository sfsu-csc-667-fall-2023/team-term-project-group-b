const { createHash } = require("crypto");


const emitToChat = (message, roomId) =>{
    const io = request.app.get("io");
    io.emit(`chat:message:${roomId}`, {
        hash: createHash("sha256").update("Server").digest("hex"),
        from: "Server",
        timestamp: Date.now(),
        message,
    });
}
module.exports = {
    emitToChat,
};