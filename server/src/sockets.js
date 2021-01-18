const http = require('http');
const socketio = require('socket.io');

const server = http.createServer();

const origin = `http://${process.env.STATIC_HOST}:${process.env.STATIC_PORT}`;
const io = socketio(server, { cors: { origin: origin } });

var gid = 0; // game id
var uid = 0; // user id

io.on('connect', socket => {
    console.log(`${socket.id} connected`);
    socket.emit('userID', (uid++).toString());

        
    socket.on('disconnecting', () => {
        for (const room of socket.rooms) {
            let matches = room.match(/(?<gameID>\d+):(?<userID>\d+)/);
            if ( matches ) {
                let gameID = matches[1];
                let userID = matches[2];
                socket.to(gameID).emit('user disconnected', userID, gameID);
            }
        }
    });

    socket.on('create request', (userID) => {
        let gameID = (gid++).toString();
        socket.join([gameID, `${gameID}:${userID}`, `${gameID}:host`]);
        socket.emit('create response', userID, gameID);
    })

    socket.on('join request', (userID, gameID) => {
        socket.join([gameID, `${gameID}:${userID}`]);
        socket.emit('join response', userID, gameID);
    })

    socket.on('update request', (userID, gameID) => {
        io.to(`${gameID}:host`).emit('update request', userID, gameID);
    });

    socket.on('update response', (userID, gameJSON) => {
        let gameID = JSON.parse(gameJSON).id;
        io.to(`${gameID}:${userID}`).emit('update response', userID, gameJSON);
    });

    socket.on('update', (gameJSON) => {
        let gameID = JSON.parse(gameJSON).id;
        socket.to(`${gameID}`).emit('update', gameJSON);
    });

});

module.exports = server;