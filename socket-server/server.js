import { Server } from "socket.io";

const io = new Server(3001, {
  cors: {
    origin: "http://localhost:3000",
  },
});

console.log("Socket.IO server running on port 3001");

io.on("connection", (socket) => {
  const userId = socket.handshake.auth.userId;

  console.log("User connected:", userId);
  console.log("Socket ID:", socket.id);

  socket.on("join-room", (room) => {
    socket.join(room);

    console.log(`${socket.id} joined ${room}`);
  });

  socket.on("send-message", ({ room, message }) => {
    console.log(`Message in ${room}:`, message);

    io.to(room).emit("message", {
      message: message,
      sender: userId,
    });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});
