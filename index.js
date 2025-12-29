const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use("/public", express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let rooms = {

}

io.on('connection', (socket) => {
  socket.on('joinedRoom', (data) => {
    socket.join("room" + data.room)
    console.log(data.name + " joined room " + data.room)
    if (rooms.hasOwnProperty(data.room)){
      rooms[data.room] = String(parseInt(rooms[data.room]) + 1);
    } else {
      rooms[data.room] = "1";
    }
    console.log(rooms);
    io.emit("numberOfClients", [rooms, data.name])  
  })
  socket.on('keyClicked', (data) => {
    io.emit('move', [data[0], data[1], data[2]]);
  })
  socket.on("startGame", (data) => {
    console.log('start!');
    setTimeout(function(){}, 3000)
    io.emit('gameStarted');
  })
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});