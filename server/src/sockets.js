const http = require('http');
const socketio = require('socket.io');

const server = http.createServer();

const origin = `http://${process.env.STATIC_HOST}:${process.env.STATIC_PORT}`;
const io = socketio(server, { cors: { origin: origin } });

io.on('connect', socket => {
    console.log(`${socket.id} connected`);
    socket.on('disconnect', () => console.log(`${socket.id} disconnected`));
});

module.exports = server;