const app = require("express")
const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
    cors: {
        origin: "https://ankityande.github.io/socket-paint-client/",
        credentials: true
    },
});

io.on("connection", (socket) => {
    // console.log("User Connected", socket.id);

    socket.on('canvas-data', (image, room) => {
        if (room) {
            // console.log("sending to room", room, "connected to room", socket.rooms)
            socket.to(room).emit('canvas-data', image);
        }
        // else {
        //     // console.log("broadcasting")
        //     socket.broadcast.emit('canvas-data', image)
        // }
    })

    socket.on('clear-canvas', (room) => {
        console.log("clear in server")
        if (room) {
            socket.to(room).emit('clear-canvas');
        }
    })

    socket.on('join-room', (room, cb) => {
        socket.join(room)
        cb(`Joined ${room}`)
    })

    socket.on('disconnect', function () {
        // console.log(socket.id, 'disconnected');
    });
});

const port = process.env.PORT || 3001;
httpServer.listen(port, () => {
    console.log("running on port", port);
})