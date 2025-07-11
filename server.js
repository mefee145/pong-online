const express = require("express");
const http = require("http");
const socket = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use(express.static("public"));

let players = {};
let playerNames = {};

io.on("connection", (socket) => {
    socket.on("join", (name) => {
        if (Object.keys(players).length >= 2) {
            socket.emit("full");
            return;
        }

        playerNames[socket.id] = name;
        players[socket.id] = { y: 250 };

        console.log(`${name} bağlandı!`);

        io.emit("lobby", Object.values(playerNames));

        if (Object.keys(players).length === 2) {
            io.emit("startGame");
        }
    });

    socket.on("move", (y) => {
        if (players[socket.id]) {
            players[socket.id].y = y;
            io.emit("players", players);
        }
    });

    socket.on("disconnect", () => {
        delete players[socket.id];
        delete playerNames[socket.id];
        io.emit("lobby", Object.values(playerNames));
    });
});

server.listen(3000, () => {
    console.log("Sunucu hazır: http://localhost:3000");
});
