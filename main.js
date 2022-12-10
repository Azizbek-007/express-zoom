// imports
const express = require("express");
const app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


const { ExpressPeerServer } = require('peer');
const peerServer = ExpressPeerServer(server, {
  debug: true
});
// import uuid
const { v4: uuidv4 } = require('uuid');


// init view engine (ejs)
app.set('view engine', 'ejs')
app.use(express.static('asset'))

// routes
app.use('/peerjs', peerServer);

app.get('/', (req, res) => { 
    // create room 
    const uuid = uuidv4();
    res.redirect(`/${uuid}`);
})

app.get('/:room', (req, res) => {
    res.render('index', {room_id: req.params.room})
})

// socket io conecting
io.on('connection', function(socket) {
    console.log('a user connected');
    socket.on('join-room', (roomId, userId) => {
        
        socket.join(roomId)
        socket.to(roomId)
        socket.broadcast.emit('user-connected', userId);
    
        socket.on('disconnect', () => {
          socket.to(roomId)
          socket.emit('user-disconnected', userId)
        })
      })
});
// listen server
server.listen(3000, () => {
    console.log('listening on *:3000');
  });