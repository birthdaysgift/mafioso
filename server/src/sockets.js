const http = require('http');
const socketio = require('socket.io');

const server = http.createServer();

const origin = `http://${process.env.STATIC_HOST}:${process.env.STATIC_PORT}`;
const io = socketio(server, { cors: { origin: origin } });

var gid = 0; // game id
var uid = 0; // user id

io.on('connect', socket => {
    console.log(`${socket.id} connected`);

    socket.on('disconnect', () => console.log(`${socket.id} disconnected`));

    socket.on('create request', () => {
        let [gameID, userID] = [(gid++).toString(), (uid++).toString()];
        socket.join([gameID, `${gameID}:${userID}`, `${gameID}:host`]);
        socket.emit('create response', userID, gameID);
    })

});

module.exports = server;