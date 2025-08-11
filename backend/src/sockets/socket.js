let io = null;

exports.initSocket = (server) => {
  const { Server } = require("socket.io");
  io = new Server(server, {
    cors: { origin: process.env.FRONTEND_URL || "*" },
  });
  io.on("connection", (socket) => {
    console.log("Socket connected", socket.id);
    socket.on("joinEventRoom", ({ eventId }) => {
      socket.join(String(eventId));
    });
    socket.on("disconnect", () => {});
  });
};

exports.getIO = () => io;
