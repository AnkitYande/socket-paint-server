const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://ankityande.github.io/socket-paint-client/",
    // origin: "http://localhost:3000",
    credentials: true,
  },
});

const canvasState = {}; // Store canvas state per room

io.on("connection", (socket) => {
  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("draw-data", ({ x, y, lastX, lastY, color, size, room }) => {
    socket.to(room).emit("draw-data", { x, y, lastX, lastY, color, size });
  });

  socket.on("clear-canvas", (room) => {
    io.to(room).emit("clear-canvas");
    canvasState[room] = null; // Clear stored canvas state
  });

  socket.on("save-canvas", ({ room, dataUrl }) => {
    canvasState[room] = dataUrl;
  });

  socket.on("request-canvas", (room) => {
    if (canvasState[room]) {
      socket.emit("load-canvas", canvasState[room]);
    }
  });
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
    console.log("running on port", port);
})
